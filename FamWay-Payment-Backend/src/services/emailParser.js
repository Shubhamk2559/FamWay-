const AMOUNT_RE = /successfully\s+received\s*(?:\u20B9|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/i;
const UTR_RE = /\bUTR\s*:?\s*(\d{9,20})/i;
const TXN_RE = /Transaction\s*ID\s*:?\s*([A-Z0-9]{8,40})/i;

const domainOf = (addr) => String(addr || "").split("@").pop().toLowerCase();
const domainAllowed = (d, allowed) => allowed.some((a) => d === a || d.endsWith(`.${a}`));

function normGmail(addr) {
  const a = String(addr || "").toLowerCase().trim();
  const [local, domain] = a.split("@");
  if (!domain) return a;
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${local.split("+")[0].replace(/\./g, "")}@gmail.com`;
  }
  return a;
}

// Only trust Authentication-Results lines added by Google itself.
// A sender can add fake ones, but Google's always start with "mx.google.com;".
function googleAuthResults(mail) {
  const raw = mail.headers && mail.headers.get("authentication-results");
  return (Array.isArray(raw) ? raw : [raw])
    .filter(Boolean)
    .map((v) => (typeof v === "string" ? v : v && v.value ? String(v.value) : ""))
    .map((v) => v.replace(/\s+/g, " ").trim())
    .filter((v) => /^mx\.google\.com\s*;/i.test(v));
}

function checkEmail(mail, { merchantGmail, allowedDomains, strict }) {
  const from = mail.from && mail.from.value && mail.from.value[0];
  const fromDomain = domainOf(from && from.address);
  if (!fromDomain || !domainAllowed(fromDomain, allowedDomains)) {
    return { ok: false, reason: `sender domain not allowed (${fromDomain || "none"})` };
  }
  if (!strict) return { ok: true };

  const recipients = []
    .concat(mail.to || [])
    .flatMap((t) => (t && t.value) || [])
    .map((v) => normGmail(v.address));
  if (!recipients.includes(normGmail(merchantGmail))) {
    return { ok: false, reason: "email was not addressed to the merchant Gmail" };
  }

  const results = googleAuthResults(mail);
  if (!results.length) return { ok: false, reason: "no Gmail authentication result on email" };

  for (const r of results) {
    const dmarc = /dmarc=pass[^;]*header\.from=@?([^\s;)]+)/i.exec(r);
    if (dmarc && domainAllowed(dmarc[1].toLowerCase(), allowedDomains)) return { ok: true };
    const dkim = /dkim=pass[^;]*header\.(?:d|i)=@?([^\s;)]+)/i.exec(r);
    if (dkim && domainAllowed(dkim[1].toLowerCase(), allowedDomains)) return { ok: true };
  }
  return { ok: false, reason: "DMARC/DKIM did not pass for the allowed sender domain" };
}

function emailText(mail) {
  let t = mail.text || "";
  if (!t && mail.html) {
    t = String(mail.html)
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&#8377;|&#x20b9;/gi, "\u20B9")
      .replace(/&amp;/gi, "&");
  }
  return t.replace(/\s+/g, " ").trim();
}

// "1,234.5" -> 123450 (no floating point)
function toPaise(str) {
  const [r, f = ""] = String(str).replace(/,/g, "").split(".");
  const p = Number(r) * 100 + Number((f + "00").slice(0, 2));
  return Number.isSafeInteger(p) ? p : NaN;
}

function parsePaymentEmail(mail) {
  const text = emailText(mail);
  const m = AMOUNT_RE.exec(text);
  if (!m) return { ok: false, reason: "not a payment-received email" };

  const amountPaise = toPaise(m[1]);
  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    return { ok: false, reason: "amount could not be read" };
  }

  const utr = (UTR_RE.exec(text) || [])[1];
  const txnId = (TXN_RE.exec(text) || [])[1];
  const reference = utr || txnId;
  if (!reference) return { ok: false, reason: "no UTR or transaction ID in email" };

  return { ok: true, amountPaise, reference };
}

module.exports = { checkEmail, parsePaymentEmail, toPaise };
