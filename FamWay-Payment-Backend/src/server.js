const env = require("./config/env");
const connectDB = require("./config/db");
const app = require("./app");
const mongoose = require("mongoose");
const emailWorker = require("./workers/emailWorker");

async function start() {
  await connectDB();
  const server = app.listen(env.port, "0.0.0.0", () => {
    console.log(`FamWay backend running on port ${env.port} (${env.nodeEnv})`);
  });

  emailWorker.start();

  const shutdown = (signal) => {
    console.log(`${signal} received, shutting down`);
    emailWorker.stop();
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

process.on("unhandledRejection", (err) => console.error("Unhandled rejection:", err));

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
