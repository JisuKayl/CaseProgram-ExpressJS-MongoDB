const winston = require("winston");
const { format } = winston;
require("winston-mongodb");
const db = require("../database/mongoose");

const infoLogger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      level: "info",
      db: db,
      collection: "infoLogs",
      //   format: format.combine(format.timestamp(), format.json()),
      //   maxSize: 10,
    }),
  ],
});

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      level: "error",
      db: db,
      collection: "errorLogs",
      //   format: format.combine(format.timestamp(), format.json()),
      //   maxSize: 10,
    }),
  ],
});

module.exports = { infoLogger, errorLogger };
