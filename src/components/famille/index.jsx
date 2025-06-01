import React, { useState, useEffect } from "react";
import "./famille.css";

const Famille = ({ id_famille }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [famille, setFamille] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_famille) return;
    setLoading(true);

    fetch(`${API_URL}/famille/readOne/${id_famille}`)
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't fetch famille data");
        return res.json();
      })
      .then((data) => {
        setFamille(data.famille);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching famille data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id_famille]);

  if (loading) return <div className="famille-card">Chargement...</div>;
  if (error) return <div className="famille-card">Erreur: {error}</div>;
  if (!famille)
    return <div className="famille-card">Aucune famille trouvé</div>;

  return (
    <div className="famille-card" style={{ width: "350px" }}>
      <div className="card-body">
        <h5 className="card-title">{famille.libelle}</h5>
        <p className="card-text">{famille.description}</p>
      </div>
    </div>
  );
};

export default Famille;
