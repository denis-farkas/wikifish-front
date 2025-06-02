import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./backFamille.css";
import { toast } from "react-toastify";
import { logger } from "../../services/logger.service.js";

const BackFamille = () => {
  const [familles, setFamilles] = useState(null);

  useEffect(() => {
    logger.info(
      "BackFamille component mounted - Admin accessing families management"
    );

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
        logger.info("Families loaded successfully for admin", {
          count: response.data.familles?.length || 0,
        });
      })
      .catch((error) => {
        logger.error("Failed to load families for admin", {
          error: error.message,
          status: error.response?.status,
          url: config.url,
        });
        console.log(error);
      });
  }, []);

  const handleDelete = (id_famille) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette famille ?")) {
      const actualUser = JSON.parse(localStorage.getItem("user"));

      if (!actualUser || actualUser.role !== "admin") {
        logger.warn("Unauthorized attempt to delete family", {
          family_id: id_famille,
          user_role: actualUser?.role,
          user_id: actualUser?.userId,
        });

        toast.error("Vous n'avez pas les droits pour effectuer cette action");
        return;
      }

      logger.info("Admin starting family deletion", {
        family_id: id_famille,
        admin_id: actualUser.userId,
      });

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
            logger.info("Family deleted successfully by admin", {
              family_id: id_famille,
              admin_id: actualUser.userId,
            });

            toast.success("Famille supprimée avec succès");
            // Update state to remove the deleted famille
            setFamilles(
              familles.filter((famille) => famille.id_famille !== id_famille)
            );
          }
        })
        .catch((error) => {
          logger.error("Failed to delete family", {
            family_id: id_famille,
            error: error.message,
            status: error.response?.status,
            admin_id: actualUser.userId,
          });

          console.error(error);
          const errorMessage = error.response
            ? error.response.data.message || "Une erreur est survenue"
            : "Une erreur est survenue";
          toast.error(errorMessage);
        });
    }
  };

  const handleCreateClick = () => {
    logger.info("Admin navigating to create new family");
  };

  const handleEditClick = (familleId) => {
    logger.info("Admin navigating to edit family", {
      family_id: familleId,
    });
  };

  const handleBackToOffice = () => {
    logger.info("Admin returning to back office from families management");
  };

  return (
    <div className="main">
      <h1>Familles</h1>
      <Link
        to="/backFamille/create"
        className="btn btn-success my-4"
        onClick={handleCreateClick}
      >
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
                    onClick={() => handleEditClick(famille.id_famille)}
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
              <td colSpan="4">
                <p>Pas de familles à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link
        to={"/backOffice"}
        className="btn btn-secondary my-4 mx-auto"
        aria-label="Retour à la page d'accueil de l'administration"
        onClick={handleBackToOffice}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default BackFamille;
