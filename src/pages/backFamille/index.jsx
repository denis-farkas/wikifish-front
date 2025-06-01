import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./backFamille.css";
import { toast } from "react-toastify";

const BackFamille = () => {
  const [familles, setFamilles] = useState(null);
  console.log(familles);
  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3009/famille/read",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setFamilles(response.data.familles);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id_famille) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette famille ?")) {
      const actualUser = JSON.parse(localStorage.getItem("user"));

      if (!actualUser || actualUser.role !== "admin") {
        toast.error("Vous n'avez pas les droits pour effectuer cette action");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3009";
      const token = actualUser.token;

      let config = {
        method: "delete",
        url: `${API_URL}/famille/delete/${id_famille}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Famille supprimée avec succès");
            // Update state to remove the deleted famille
            setFamilles(
              familles.filter((famille) => famille.id_famille !== id_famille)
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
      <h1>Familles</h1>
      <Link to="/backFamille/create" className="btn btn-success my-4">
        Créer famille
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "5%" }} aria-label="Identifiant de la famille">
              Id
            </th>

            <th style={{ width: "30%" }} aria-label="Libellé de la famille">
              Libellé
            </th>
            <th style={{ width: "30%" }} aria-label="Description de la famille">
              Description
            </th>
            <th style={{ width: "30%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {familles &&
            familles.map((famille) => (
              <tr key={famille.id_famille}>
                <td>{famille.id_famille}</td>
                <td>{famille.libelle}</td>
                <td>{famille.description}</td>
                <td>
                  <Link
                    to={`/backFamille/update/${famille.id_famille}`}
                    className="btn btn-primary"
                    aria-label="Editer la famille"
                  >
                    Editer
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => handleDelete(famille.id_famille)}
                    aria-label="Supprimer la famille"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

          {familles && !familles.length && (
            <tr>
              <td>
                <p>Pas de familles à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BackFamille;
