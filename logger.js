const winston = require("winston");
winston.emitErrs = true;

let transports = [];

if (process.env.LOGS === "DEV") {
  transports.push(
    new winston.transports.Console({
      handleExceptions: true,
      json: false,
      colorize: true
    })
  );
} else if (process.env.LOGS === "ALL_FILES") {
  transports.push(
    new winston.transports.File({
      filename: "./logs/all.log",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 3,
      colorize: false,
      timestamp: function() {
        return new Date().toISOString();
      }
    })
  );
} else {
  transports.push(
    new winston.transports.File({
      name: "error-file",
      level: "error",
      filename: "./logs/error.log",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 3,
      colorize: false,
      timestamp: function() {
        return new Date().toISOString();
      }
    })
  );

  transports.push(
    new winston.transports.File({
      name: "warning-file",
      level: "warn",
      filename: "./logs/warning.log",
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 3,
      colorize: false,
      timestamp: function() {
        return new Date().toISOString();
      }
    })
  );
}

const logger = new winston.Logger({
  transports,
  exitOnError: false
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
