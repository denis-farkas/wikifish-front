import React, { useEffect, useState } from "react";
import axios from "axios";
import EspeceCard from "../../components/especeCard";
import { toast } from "react-toastify";
import SearchBar from "../../components/searchBar";

function groupByFamille(especes) {
  return especes.reduce((acc, espece) => {
    // Safely access famille - use the name or a fallback
    const familleNom = espece.famille || "Autre";
    if (!acc[familleNom]) acc[familleNom] = [];
    acc[familleNom].push(espece);
    return acc;
  }, {});
}

export default function EspecesByFamille() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use environment variable for API URL
    const API_URL = import.meta.env.VITE_API_URL;

    setLoading(true);

    axios
      .get(`${API_URL}/espece/read`)
      .then((response) => {
        const fetchedEspeces = response.data.especes || [];
        // Group especes and update state in one go
        setGrouped(groupByFamille(fetchedEspeces));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching especes:", error);
        setError("Erreur lors du chargement des espèces");
        toast.error("Erreur lors du chargement des espèces");
        setLoading(false);
      });
  }, []); // Empty dependency array - only run once on mount

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des espèces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        {error}
      </div>
    );
  }

  // Handle empty state
  if (Object.keys(grouped).length === 0) {
    return (
      <div className="alert alert-info m-5" role="alert">
        Aucune espèce trouvée. Contactez l'administrateur pour ajouter des
        espèces.
      </div>
    );
  }

  return (
    <div className="container my-4">
      <SearchBar />
      <h1 className="text-center mb-5">Espèces par Famille</h1>
      {Object.entries(grouped).map(([famille, especes]) => (
        <div key={famille} className="mb-5">
          <h2 className="bg-light p-3 rounded">{famille}</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {especes.map((espece) => (
              <div className="col" key={espece.id_espece}>
                <EspeceCard espece={espece} />
              </div>
            ))}
          </div>
          <hr />
          <p className="text-muted fst-italic">
            {especes.length} espèce{especes.length > 1 ? "s" : ""} trouvée
            {especes.length > 1 ? "s" : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
