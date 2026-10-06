const { simpleParser } = require("mailparser");
const env = require("../config/env");
const Merchant = require("../models/Merchant");
const Order = require("../models/Order");
const ProcessedEmail = require("../models/ProcessedEmail");
const { decrypt } = require("../utils/crypto");
const { markOrderPaid } = require("../services/orderService");
const { fetchCandidates } = require("../services/gmailService");
const { checkEmail, parsePaymentEmail } = require("../services/emailParser");

const cfg = env.email;
const lookbackMs = cfg.lookbackMinutes * 60 * 1000;
const graceMs = cfg.matchGraceMinutes * 60 * 1000;
const SKEW_MS = 60 * 1000;
const STALE_CLAIM_MS = 2 * 60 * 1000;
const CONCURRENCY = 3;

const backoff = new Map(); // key -> { until, fails }
const connected = new Set();

let timer = null;
let stopping = false;
let current = null;

const tag = (m) => String(m._id).slice(-6);
const rs = (paise) => (paise / 100).toFixed(2);
const mask = (ref) => (ref ? `***${String(ref).slice(-4)}` : "-");
const safeErr = (e) => String((e && (e.responseText || e.message)) || "unknown").slice(0, 120);

async function filterUnseen(merchantId, items) {
  if (!items.length) return [];
  const staleBefore = new Date(Date.now() - STALE_CLAIM_MS);
  const seen = await ProcessedEmail.find({
    merchant: merchantId,
    messageKey: { $in: items.map((i) => i.messageKey) },
    $nor: [{ result: "processing", createdAt: { $lt: staleBefore } }],
  })
    .select("messageKey")
    .lean();
  const set = new Set(seen.map((s) => s.messageKey));
  return items.filter((i) => !set.has(i.messageKey));
}

async function handleEmail(m, item) {
  const id = tag(m);

  // Remove a claim left behind by a crashed run, then claim this email.
  await ProcessedEmail.deleteOne({
    merchant: m._id,
    messageKey: item.messageKey,
    result: "processing",
    createdAt: { $lt: new Date(Date.now() - STALE_CLAIM_MS) },
  });

  let claim;
  try {
    claim = await ProcessedEmail.create({
      merchant: m._id,
      messageKey: item.messageKey,
      result: "processing",
      receivedAt: item.internalDate,
    });
  } catch (e) {
    if (e && e.code === 11000) return; // already handled (or being handled) elsewhere
    throw e;
  }

  const done = (result, extra = {}) =>
    ProcessedEmail.updateOne({ _id: claim._id }, { $set: { result, ...extra } });

  try {
    const mail = await simpleParser(item.source);

    const check = checkEmail(mail, {
      merchantGmail: m.gmailAddress,
      allowedDomains: cfg.senderDomains,
      strict: cfg.strictVerify,
    });
    if (!check.ok) {
      console.warn(`[email] ${id} email skipped: ${check.reason}`);
      return await done("rejected", { reason: check.reason });
    }

    const info = parsePaymentEmail(mail);
    if (!info.ok) {
      console.log(`[email] ${id} email ignored: ${info.reason}`);
      return await done("ignored", { reason: info.reason });
    }

    console.log(`[email] ${id} payment email detected: Rs.${rs(info.amountPaise)} ref ${mask(info.reference)}`);
    const common = { amountPaise: info.amountPaise, utr: info.reference };

    if (await Order.exists({ utr: info.reference })) {
      console.warn(`[email] ${id} duplicate reference ${mask(info.reference)}, already used`);
      return await done("duplicate", common);
    }

    const at = item.internalDate instanceof Date && !isNaN(item.internalDate) ? item.internalDate : new Date();

    let order;
    try {
      order = await markOrderPaid(
        {
          merchant: m._id,
          payAmountPaise: info.amountPaise,
          createdAt: { $lte: new Date(at.getTime() + SKEW_MS) },
          expiresAt: { $gte: new Date(at.getTime() - graceMs) },
        },
        { utr: info.reference, via: "email" }
      );
    } catch (e) {
      if (e && e.code === 11000) {
        console.warn(`[email] ${id} duplicate reference ${mask(info.reference)}, already used`);
        return await done("duplicate", common);
      }
      throw e;
    }

    if (!order) {
      console.log(`[email] ${id} no matching order for Rs.${rs(info.amountPaise)}`);
      return await done("no_match", { ...common, reason: "no pending order for this amount" });
    }

    console.log(`[email] ${id} matched order ${order.orderNumber}`);
    console.log(`[email] ${id} order ${order.orderNumber} marked paid (Rs.${rs(info.amountPaise)})`);
    return await done("paid", { ...common, order: order._id });
  } catch (err) {
    // Release the claim so the email is retried on the next cycle.
    await ProcessedEmail.deleteOne({ _id: claim._id }).catch(() => {});
    throw err;
  }
}

async function checkMerchant(m) {
  const id = tag(m);
  // updatedAt changes when the merchant saves new settings, which resets the backoff.
  const key = `${m._id}:${m.updatedAt ? m.updatedAt.getTime() : 0}`;
  const b = backoff.get(key);
  if (b && Date.now() < b.until) return;

  let pass;
  try {
    pass = decrypt(m.gmailAppPasswordEnc);
  } catch (_e) {
    console.error(`[email] ${id} could not decrypt saved Gmail credentials. Merchant must re-save them.`);
    backoff.set(key, { until: Date.now() + 60 * 60 * 1000, fails: 1 });
    return;
  }

  try {
    const items = await fetchCandidates({
      user: m.gmailAddress,
      pass,
      lookbackMs,
      senderDomains: cfg.senderDomains,
      filterUnseen: (list) => filterUnseen(m._id, list),
    });
    pass = null;

    if (!connected.has(id)) {
      connected.add(id);
      console.log(`[email] ${id} Gmail connection successful`);
    }
    backoff.delete(key);

    for (const item of items) {
      try {
        await handleEmail(m, item);
      } catch (e) {
        console.error(`[email] ${id} error processing an email: ${safeErr(e)}`);
      }
    }
  } catch (err) {
    pass = null;
    connected.delete(id);
    const fails = (b ? b.fails : 0) + 1;
    const authFailed = Boolean(err && err.authenticationFailed);
    const waitMs = authFailed ? 10 * 60 * 1000 : Math.min(30000 * 2 ** (fails - 1), 5 * 60 * 1000);
    backoff.set(key, { until: Date.now() + waitMs, fails });
    console.error(
      `[email] ${id} IMAP error: ${authFailed ? "Gmail login failed (check address and app password)" : safeErr(err)}. ` +
        `Retrying in ${Math.round(waitMs / 1000)}s`
    );
  }
}

async function runCycle() {
  const ids = await Order.distinct("merchant", {
    status: "pending",
    expiresAt: { $gte: new Date(Date.now() - graceMs) },
  });
  if (!ids.length) return;

  const merchants = await Merchant.find({
    _id: { $in: ids },
    status: "active",
    gmailAddress: { $exists: true, $ne: "" },
    gmailAppPasswordEnc: { $exists: true, $ne: null },
  }).select("+gmailAppPasswordEnc");
  if (!merchants.length) return;

  console.log(`[email] checking payment emails for ${merchants.length} merchant(s)`);
  for (let i = 0; i < merchants.length; i += CONCURRENCY) {
    await Promise.allSettled(merchants.slice(i, i + CONCURRENCY).map(checkMerchant));
  }
}

function schedule(ms) {
  if (stopping) return;
  timer = setTimeout(tick, ms);
}

async function tick() {
  timer = null;
  current = runCycle().catch((e) => console.error("[email] cycle error:", safeErr(e)));
  await current;
  current = null;
  schedule(cfg.pollIntervalSeconds * 1000);
}

function start() {
  if (!cfg.workerEnabled) {
    console.log("[email] worker disabled (EMAIL_WORKER_ENABLED=false)");
    return;
  }
  console.log(`[email] worker started, checking every ${cfg.pollIntervalSeconds}s while orders are pending`);
  schedule(5000);
}

function stop() {
  stopping = true;
  if (timer) clearTimeout(timer);
  return current;
}

module.exports = { start, stop };
