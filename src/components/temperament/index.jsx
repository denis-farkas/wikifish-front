import React, { useState, useEffect } from "react";
import "./temperament.css"; // You'll need to create this file for custom styles

const Temperament = ({ id_temperament }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [temperament, setTemperament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_temperament) return;
    setLoading(true);

    fetch(`${API_URL}/temperament/readOne/${id_temperament}`)
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't fetch temperament data");
        return res.json();
      })
      .then((data) => {
        setTemperament(data.temperament);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching temperament data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id_temperament, API_URL]);

  if (loading) return <div className="temperament-card">Chargement...</div>;
  if (error) return <div className="temperament-card">Erreur: {error}</div>;
  if (!temperament)
    return <div className="temperament-card">Aucun temperament trouvé</div>;

  return (
    <div className="temperament-card" style={{ width: "350px" }}>
      <div className="card-body">
        <h5 className="card-title">{temperament.libelle}</h5>
        <p className="card-text">{temperament.description}</p>
      </div>
    </div>
  );
};

export default Temperament;
