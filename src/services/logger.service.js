// filepath: src/services/logger.service.js
import { logStorage } from "./logStorage.service.js";

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  constructor() {
    this.logLevel = LogLevel.INFO;
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level) {
    this.logLevel = level;
  }

  log(level, message, data = null) {
    if (level < this.logLevel) return;

    const timestamp = new Date().toISOString();
    const levelStr = Object.keys(LogLevel)[level];
    const logMessage = `[${timestamp}] [${levelStr}] ${message}`;

    // Stockage du log
    logStorage.addLog(levelStr, message, data);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, data || "");
        break;
      case LogLevel.INFO:
        console.info(logMessage, data || "");
        break;
      case LogLevel.WARN:
        console.warn(logMessage, data || "");
        break;
      case LogLevel.ERROR:
        console.error(logMessage, data || "");
        break;
    }
  }

  debug(message, data = null) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message, data = null) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message, data = null) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message, data = null) {
    this.log(LogLevel.ERROR, message, data);
  }
}

export const logger = Logger.getInstance();
