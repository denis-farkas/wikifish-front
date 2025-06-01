import React, { useState, useEffect } from "react";
import "./habitat.css"; // You'll need to create this file for custom styles

const Habitat = ({ id_habitat }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [habitat, setHabitat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id_habitat) return;
    setLoading(true);

    fetch(`${API_URL}/habitat/readOne/${id_habitat}`)
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't fetch habitat data");
        return res.json();
      })
      .then((data) => {
        setHabitat(data.habitat);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching habitat data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id_habitat]);

  if (loading) return <div className="habitat-card">Chargement...</div>;
  if (error) return <div className="habitat-card">Erreur: {error}</div>;
  if (!habitat) return <div className="habitat-card">Aucun habitat trouvé</div>;

  return (
    <div className="habitat-card" style={{ width: "350px" }}>
      <div className="card-body">
        <h5 className="card-title">{habitat.libelle}</h5>
        <p className="card-text">{habitat.description}</p>
      </div>
    </div>
  );
};

export default Habitat;
