const winston = require("winston");
const { format } = winston;
require("winston-mongodb");
const db = require("../database/mongoose");

const infoLogger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
      db: db,
      collection: "infoLogs",
    }),
  ],
});

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
      db: db,
      collection: "errorLogs",
    }),
  ],
});

module.exports = { infoLogger, errorLogger };
