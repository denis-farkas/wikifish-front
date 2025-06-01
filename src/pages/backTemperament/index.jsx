import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./backTemperament.css";

const BackTemperament = () => {
  const [temperaments, setTemperaments] = useState(null);
  console.log(temperaments);
  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3009/temperament/read",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setTemperaments(response.data.temperaments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id_temperament) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce tempérament ?")) {
      const actualUser = JSON.parse(localStorage.getItem("user"));

      if (!actualUser || actualUser.role !== "admin") {
        toast.error("Vous n'avez pas les droits pour effectuer cette action");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3009";
      const token = actualUser.token;

      let config = {
        method: "delete",
        url: `${API_URL}/temperament/delete/${id_temperament}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Temperament supprimé avec succès");
            // Update state to remove the deleted temperament
            setTemperaments(
              temperaments.filter(
                (temperament) => temperament.id_temperament !== id_temperament
              )
            );
          }
        })
        .catch((error) => {
          console.error(error);
          const errorMessage = error.response
            ? error.response.data.message || "Une erreur est survenue"
            : "Une erreur est survenue";
          toast.error(errorMessage);
        });
    }
  };

  return (
    <div className="main">
      <h1>Tempéraments</h1>
      <Link to="/backTemperament/create" className="btn btn-success my-4">
        Créer tempérament
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "5%" }} aria-label="Identifiant du temperament">
              Id
            </th>

            <th style={{ width: "30%" }} aria-label="Libellé du temperament">
              Libellé
            </th>
            <th
              style={{ width: "30%" }}
              aria-label="Description du temperament"
            >
              Description
            </th>
            <th style={{ width: "30%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {temperaments &&
            temperaments.map((temperament) => (
              <tr key={temperament.id_temperament}>
                <td>{temperament.id_temperament}</td>
                <td>{temperament.libelle}</td>
                <td>{temperament.description}</td>
                <td>
                  <Link
                    to={`/backTemperament/update/${temperament.id_temperament}`}
                    className="btn btn-primary"
                    aria-label="Editer le tempérament"
                  >
                    Editer
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => handleDelete(temperament.id_temperament)}
                    aria-label="Supprimer le tempérament"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

          {temperaments && !temperaments.length && (
            <tr>
              <td>
                <p>Pas de temperament à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link
        to={"/backOffice"}
        className="btn btn-secondary my-4 mx-auto"
        aria-label="Retour à la page d'accueil de l'administration"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default BackTemperament;
