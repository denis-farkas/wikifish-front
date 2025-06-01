import React, { useEffect, useState } from "react";
import "./gallery-preview.css";

const GalleryPreview = () => {
  const [especes, setEspeces] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3009";
  useEffect(() => {
    // Replace with your actual API endpoint
    fetch(`${API_URL}/espece/read`)
      .then((res) => res.json())
      .then((data) => {
        // Shuffle and pick 3 random especes
        const shuffled = data.especes.sort(() => 0.5 - Math.random());
        setEspeces(shuffled.slice(0, 3));
      })
      .catch((err) => {
        console.error("Error fetching especes:", err);
        setEspeces([]);
      });
  }, []);

  return (
    <div className="gallery-preview">
      <h2 className="preview-title">De nombreuses espéces</h2>
      <h6>
        <em>
          Classées par grandes familles et ordre alphabétique, avec fonction de
          recherche avancée
        </em>
      </h6>
      <div className="gallery-cards">
        {especes.map((espece) => (
          <div className="gallery-card" key={espece.id_espece}>
            <img
              src={espece.image_1 || "/placeholder.jpg"}
              alt={espece.name}
              className="gallery-card-image"
            />
            <div className="gallery-card-content">
              <h3>{espece.name}</h3>
              <p>{espece.description}</p>
            </div>
          </div>
        ))}
      </div>
      <a href="/especes" className="text-white text-decoration-none">
        <button className="btn btn-blue">Voir toutes les espèces</button>
      </a>
    </div>
  );
};

export default GalleryPreview;
