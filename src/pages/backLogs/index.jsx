import { useState, useEffect } from "react";
import { logStorage } from "../../services/logStorage.service.js";
import { logger } from "../../services/logger.service.js";

const BackLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({
    level: "",
    search: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    logger.info("BackLogs component mounted");
    loadLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadLogs = () => {
    const allLogs = logStorage.getLogs();
    setLogs(allLogs);
  };

  const applyFilters = () => {
    const filtered = logStorage.getLogs(filters);
    setFilteredLogs(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearLogs = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tous les logs ?")) {
      logStorage.clearLogs();
      logger.warn("All logs cleared by administrator");
      loadLogs();
    }
  };

  const exportLogs = () => {
    logStorage.exportLogs();
    logger.info("Logs exported by administrator");
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case "ERROR":
        return "badge bg-danger";
      case "WARN":
        return "badge bg-warning text-dark";
      case "INFO":
        return "badge bg-info";
      case "DEBUG":
        return "badge bg-secondary";
      default:
        return "badge bg-light text-dark";
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Consultation des Logs</h2>
            <div>
              <button className="btn btn-primary me-2" onClick={exportLogs}>
                <i className="bi bi-download me-1"></i>
                Exporter
              </button>
              <button className="btn btn-danger" onClick={clearLogs}>
                <i className="bi bi-trash me-1"></i>
                Vider les logs
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Filtres</h5>
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label">Niveau</label>
                  <select
                    className="form-select"
                    value={filters.level}
                    onChange={(e) =>
                      handleFilterChange("level", e.target.value)
                    }
                  >
                    <option value="">Tous</option>
                    <option value="ERROR">ERROR</option>
                    <option value="WARN">WARN</option>
                    <option value="INFO">INFO</option>
                    <option value="DEBUG">DEBUG</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Recherche</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechercher dans les messages..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Date début</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Date fin</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Total</h5>
                  <h3 className="text-primary">{logs.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Erreurs</h5>
                  <h3 className="text-danger">
                    {logs.filter((l) => l.level === "ERROR").length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Avertissements</h5>
                  <h3 className="text-warning">
                    {logs.filter((l) => l.level === "WARN").length}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Filtrés</h5>
                  <h3 className="text-info">{filteredLogs.length}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des logs */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Logs ({filteredLogs.length})</h5>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Niveau</th>
                      <th>Message</th>
                      <th>Page</th>
                      <th>Données</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <small>
                            {new Date(log.timestamp).toLocaleString()}
                          </small>
                        </td>
                        <td>
                          <span className={getLevelBadgeClass(log.level)}>
                            {log.level}
                          </span>
                        </td>
                        <td>{log.message}</td>
                        <td>
                          <small className="text-muted">{log.url}</small>
                        </td>
                        <td>
                          {log.data && (
                            <details>
                              <summary className="btn btn-sm btn-outline-secondary">
                                Données
                              </summary>
                              <pre className="mt-2 p-2 bg-light border rounded">
                                {JSON.stringify(log.data, null, 2)}
                              </pre>
                            </details>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredLogs.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">
                      Aucun log trouvé avec ces filtres
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackLogs;
