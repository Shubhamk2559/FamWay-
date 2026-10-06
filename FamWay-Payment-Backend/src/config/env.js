require("dotenv").config();

if (!process.env.MONGODB_URI) {
  throw new Error("Missing required env var: MONGODB_URI");
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET is required and must be at least 32 characters");
}
if (!/^[0-9a-f]{64}$/i.test(process.env.ENCRYPTION_KEY || "")) {
  throw new Error("ENCRYPTION_KEY must be 64 hex characters");
}

const num = (v, def, min) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= min ? n : def;
};
const flag = (v, def) =>
  v === undefined || v === "" ? def : !["false", "0", "no", "off"].includes(String(v).toLowerCase());

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGODB_URI,
  corsOrigins: (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  publicBaseUrl: (process.env.PUBLIC_BASE_URL || "https://famway.app").replace(/\/$/, ""),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  },
  encryptionKey: process.env.ENCRYPTION_KEY,
  email: {
    workerEnabled: flag(process.env.EMAIL_WORKER_ENABLED, true),
    pollIntervalSeconds: num(process.env.EMAIL_POLL_INTERVAL_SECONDS, 30, 15),
    lookbackMinutes: num(process.env.EMAIL_LOOKBACK_MINUTES, 60, 20),
    matchGraceMinutes: num(process.env.EMAIL_MATCH_GRACE_MINUTES, 5, 0),
    strictVerify: flag(process.env.EMAIL_STRICT_VERIFY, true),
    senderDomains: (process.env.EMAIL_SENDER_DOMAINS || "famapp.in")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || "",
    keySecret: process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  },
};
env.isProd = env.nodeEnv === "production";

module.exports = env;
