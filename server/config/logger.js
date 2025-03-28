const winston = require('winston');
const path = require('path');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  // Handle uncaught exceptions and unhandled promise rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Add request logging format
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  }
};

// Custom logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Add custom logging methods
logger.startupLog = (message) => {
  logger.info(`[STARTUP] ${message}`);
};

logger.authLog = (message, userId = null) => {
  logger.info(`[AUTH] ${userId ? `User ${userId}: ` : ''}${message}`);
};

logger.betLog = (message, userId = null, betId = null) => {
  logger.info(`[BET] ${userId ? `User ${userId}: ` : ''}${betId ? `Bet ${betId}: ` : ''}${message}`);
};

logger.paymentLog = (message, userId = null, transactionId = null) => {
  logger.info(`[PAYMENT] ${userId ? `User ${userId}: ` : ''}${transactionId ? `Transaction ${transactionId}: ` : ''}${message}`);
};

logger.securityLog = (message, severity = 'info') => {
  logger[severity](`[SECURITY] ${message}`);
};

logger.adminLog = (message, adminId = null) => {
  logger.info(`[ADMIN] ${adminId ? `Admin ${adminId}: ` : ''}${message}`);
};

// Development logging
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
          // Print log trace
          return `${timestamp} ${level}: ${message}\n${stack}`;
        }
        return `${timestamp} ${level}: ${message}`;
      })
    )
  }));
}

// Export logger instance
module.exports = logger;