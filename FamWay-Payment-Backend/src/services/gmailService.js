const { ImapFlow } = require("imapflow");

const MAX_EMAILS = 40;
const MAX_SIZE = 500 * 1024;
const HARD_TIMEOUT_MS = 45000;

// Connects, reads only recent mail from the allowed senders, disconnects.
// `filterUnseen(list)` lets the caller skip emails that were already processed,
// so full message bodies are downloaded only for new emails.
async function fetchCandidates({ user, pass, lookbackMs, senderDomains, filterUnseen }) {
  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user, pass },
    logger: false, // never let the library log protocol traffic (it contains credentials)
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 60000,
  });

  // Without a listener, a socket error would crash the whole process.
  client.on("error", (err) => {
    console.warn("[email] IMAP connection error:", String((err && err.code) || "unknown"));
  });

  const killer = setTimeout(() => client.close(), HARD_TIMEOUT_MS);

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      // IMAP SINCE only has day precision, so go back an extra day and filter exactly below.
      const since = new Date(Date.now() - lookbackMs - 24 * 60 * 60 * 1000);
      const fromQuery =
        senderDomains.length === 1
          ? { from: senderDomains[0] }
          : { or: senderDomains.map((d) => ({ from: d })) };

      const uids = await client.search({ since, ...fromQuery }, { uid: true });
      if (!uids || !uids.length) return [];

      // Step 1: cheap metadata only. Collect first, then run other commands.
      const metas = [];
      for await (const msg of client.fetch(
        uids.slice(-MAX_EMAILS),
        { uid: true, internalDate: true, envelope: true, size: true },
        { uid: true }
      )) {
        metas.push({
          uid: msg.uid,
          internalDate: msg.internalDate ? new Date(msg.internalDate) : null,
          size: msg.size || 0,
          messageKey:
            (msg.envelope && msg.envelope.messageId) ||
            `uv${String(client.mailbox.uidValidity)}:${msg.uid}`,
        });
      }

      const cutoff = Date.now() - lookbackMs;
      const recent = metas.filter(
        (m) => m.internalDate && m.internalDate.getTime() >= cutoff && m.size <= MAX_SIZE
      );
      const fresh = await filterUnseen(recent);

      // Step 2: download full source only for new emails.
      const out = [];
      for (const meta of fresh) {
        const msg = await client.fetchOne(meta.uid, { source: true }, { uid: true });
        if (msg && msg.source) out.push({ ...meta, source: msg.source });
      }
      return out;
    } finally {
      lock.release();
    }
  } finally {
    clearTimeout(killer);
    try {
      await client.logout();
    } catch (_e) {
      try {
        client.close();
      } catch (_e2) {}
    }
  }
}

module.exports = { fetchCandidates };
