const winston = require("winston");
const { format } = winston;
require("winston-mongodb");
const db = require("../database/mongoose");

const infoLogger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      level: "info",
      db: db,
      collection: "activityLogs",
    }),
  ],
});

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      level: "error",
      db: db,
      collection: "activityLogs",
    }),
  ],
});

module.exports = { infoLogger, errorLogger };
