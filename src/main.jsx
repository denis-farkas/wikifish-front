import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { logger, LogLevel } from "./services/logger.service.js";

const logLevel = import.meta.env.VITE_LOG_LEVEL || "INFO";
switch (logLevel) {
  case "DEBUG":
    logger.setLogLevel(LogLevel.DEBUG);
    break;
  case "INFO":
    logger.setLogLevel(LogLevel.INFO);
    break;
  case "WARN":
    logger.setLogLevel(LogLevel.WARN);
    break;
  case "ERROR":
    logger.setLogLevel(LogLevel.ERROR);
    break;
  default:
    logger.setLogLevel(LogLevel.INFO);
}

logger.info("Application starting", {
  logLevel: logLevel,
  timestamp: new Date().toISOString(),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
