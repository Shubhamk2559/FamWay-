const env = require("../config/env");

module.exports = (err, _req, res, _next) => {
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    message = "Duplicate value";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON body";
  }

  if (status >= 500) {
    console.error(err);
    if (!err.isOperational) message = "Internal server error";
  }

  res.status(status).json({
    success: false,
    message,
    ...(env.isProd ? {} : { stack: err.stack }),
  });
};
