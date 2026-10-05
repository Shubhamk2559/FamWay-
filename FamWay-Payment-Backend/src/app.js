const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const env = require("./config/env");
const routes = require("./routes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.set("trust proxy", 1); // Koyeb sits behind a proxy
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins.includes("*") ? true : env.corsOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (_req, res) => {
  res.json({ name: "FamWay Payment API", status: "running" });
});

app.get("/health", (_req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    status: dbUp ? "ok" : "degraded",
    db: dbUp ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use(
  "/api/auth",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false })
);

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path.startsWith("/public/"),
  })
);
app.use("/api", routes);

app.use("/pay", require("./routes/payPageRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
