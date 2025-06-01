import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { generateDateTime } from "../../utils/generateDate";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Charger l'historique récent seulement si l'utilisateur est connecté
  useEffect(() => {
    if (user && user.userId) {
      loadRecentSearches();
    }
  }, []);

  const loadRecentSearches = async () => {
    if (!user || !user.userId) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(
        `${API_URL}/historique/readByUser/${user.userId}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const recent = (response.data.historiques || []).slice(0, 5);
      setRecentSearches(recent);
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
    }
  };

  const saveSearchToHistory = async (term) => {
    // SEULEMENT si l'utilisateur est connecté
    if (!user || !user.userId) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const payload = {
        recherche: term,
        date: generateDateTime(),
        user_id: user.userId, // Utiliser user.userId
      };

      await axios.post(`${API_URL}/historique/create`, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      // Recharger l'historique récent
      loadRecentSearches();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la recherche:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // TOUJOURS naviguer vers les résultats
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);

      // Sauvegarder en historique SEULEMENT si connecté
      if (user && user.userId) {
        await saveSearchToHistory(searchTerm.trim());
      }
    }
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="d-flex my-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Rechercher une espèce..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-search me-1"></i>
          Rechercher
        </button>
      </form>

      {/* Afficher l'historique SEULEMENT si connecté */}
      {user && user.userId && recentSearches.length > 0 && (
        <div className="recent-searches mt-2">
          <small className="text-muted">Recherches récentes:</small>
          <div className="d-flex flex-wrap mt-1">
            {recentSearches.map((item, index) => (
              <button
                key={index}
                className="btn btn-sm btn-outline-secondary me-2 mb-2"
                onClick={() => handleHistoryClick(item.recherche)}
              >
                {item.recherche}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message informatif pour les utilisateurs non connectés */}
      {!user && (
        <div className="mt-2">
          <small className="text-muted">
            💡 Connectez-vous pour sauvegarder votre historique de recherche
          </small>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
