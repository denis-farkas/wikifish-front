import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SearchHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.userId) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchHistory = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;

        const response = await axios.get(
          `${API_URL}/historique/readByUser/${user.userId}`, // Utiliser user.userId
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setHistory(response.data.historiques || []);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
        toast.error("Erreur lors du chargement de l'historique");
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDeleteSearch = async (id) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.delete(`${API_URL}/historique/delete/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setHistory(history.filter((item) => item.id_historique !== id));
      toast.success("Recherche supprimée de l'historique");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (!user || !user.userId) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Vous devez être connecté pour accéder à cette page.
          <Link to="/login" className="btn btn-primary ms-3">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Une erreur s'est produite lors du chargement de l'historique.
          <button
            className="btn btn-outline-primary ms-3"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Historique de recherches</h1>

      {history.length === 0 ? (
        <div className="alert alert-info">
          Aucun historique de recherche trouvé.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Recherche</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id_historique}>
                  <td>
                    <Link
                      to={`/search?q=${encodeURIComponent(item.recherche)}`}
                    >
                      {item.recherche}
                    </Link>
                  </td>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteSearch(item.id_historique)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
