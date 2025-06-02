class LogStorage {
  constructor() {
    this.logs = JSON.parse(localStorage.getItem("app_logs") || "[]");
    this.maxLogs = 1000; // Limite le nombre de logs stockés
  }

  static getInstance() {
    if (!LogStorage.instance) {
      LogStorage.instance = new LogStorage();
    }
    return LogStorage.instance;
  }

  addLog(level, message, data = null) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      data: data,
      url: window.location.pathname,
    };

    this.logs.unshift(logEntry); // Ajoute au début

    // Limite le nombre de logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    localStorage.setItem("app_logs", JSON.stringify(this.logs));
  }

  getLogs(filter = null) {
    if (!filter) return this.logs;

    return this.logs.filter((log) => {
      if (filter.level && log.level !== filter.level) return false;
      if (
        filter.startDate &&
        new Date(log.timestamp) < new Date(filter.startDate)
      )
        return false;
      if (filter.endDate && new Date(log.timestamp) > new Date(filter.endDate))
        return false;
      if (
        filter.search &&
        !log.message.toLowerCase().includes(filter.search.toLowerCase())
      )
        return false;
      return true;
    });
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem("app_logs");
  }

  exportLogs() {
    const dataStr = JSON.stringify(this.logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `app-logs-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const logStorage = LogStorage.getInstance();
