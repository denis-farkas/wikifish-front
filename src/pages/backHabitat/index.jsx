import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { logger } from "../../services/logger.service.js";
import "./backHabitat.css";

const BackHabitat = () => {
  const [habitats, setHabitats] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    logger.info(
      "BackHabitat component mounted - Admin accessing habitats management"
    );

    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}/habitat/read`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setHabitats(response.data.habitats);
        logger.info("Habitats loaded successfully for admin", {
          count: response.data.habitats?.length || 0,
        });
      })
      .catch((error) => {
        logger.error("Failed to load habitats for admin", {
          error: error.message,
          status: error.response?.status,
          url: config.url,
        });
        console.log(error);
      });
  }, []);

  const handleDelete = (id_habitat) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet habitat ?")) {
      const actualUser = JSON.parse(localStorage.getItem("user"));

      if (!actualUser || actualUser.role !== "admin") {
        logger.warn("Unauthorized attempt to delete habitat", {
          habitat_id: id_habitat,
          user_role: actualUser?.role,
          user_id: actualUser?.userId,
        });

        toast.error("Vous n'avez pas les droits pour effectuer cette action");
        return;
      }

      logger.info("Admin starting habitat deletion", {
        habitat_id: id_habitat,
        admin_id: actualUser.userId,
      });

      const token = actualUser.token;

      let config = {
        method: "delete",
        url: `${API_URL}/habitat/delete/${id_habitat}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 200) {
            logger.info("Habitat deleted successfully by admin", {
              habitat_id: id_habitat,
              admin_id: actualUser.userId,
            });

            toast.success("Habitat supprimé avec succès");
            // Update state to remove the deleted habitat
            setHabitats(
              habitats.filter((habitat) => habitat.id_habitat !== id_habitat)
            );
          }
        })
        .catch((error) => {
          logger.error("Failed to delete habitat", {
            habitat_id: id_habitat,
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
    logger.info("Admin navigating to create new habitat");
  };

  const handleEditClick = (habitatId) => {
    logger.info("Admin navigating to edit habitat", {
      habitat_id: habitatId,
    });
  };

  const handleBackToOffice = () => {
    logger.info("Admin returning to back office from habitats management");
  };

  return (
    <div className="main">
      <h1 className="text-center">Habitats</h1>
      <Link
        to="/backHabitat/create"
        className="btn btn-success my-4"
        onClick={handleCreateClick}
      >
        Créer habitat
      </Link>
      <table className="table my-5">
        <thead>
          <tr>
            <th style={{ width: "5%" }} aria-label="Identifiant de l'habitat">
              Id
            </th>
            <th style={{ width: "30%" }} aria-label="Libellé de l'habitat">
              Libellé
            </th>
            <th style={{ width: "30%" }} aria-label="Description de l'habitat">
              Description
            </th>
            <th style={{ width: "30%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {habitats &&
            habitats.map((habitat) => (
              <tr key={habitat.id_habitat}>
                <td>{habitat.id_habitat}</td>
                <td>{habitat.libelle}</td>
                <td>{habitat.description}</td>
                <td>
                  <Link
                    to={`/backHabitat/update/${habitat.id_habitat}`}
                    className="btn btn-primary"
                    aria-label="Editer l'habitat"
                    onClick={() => handleEditClick(habitat.id_habitat)}
                  >
                    Editer
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => handleDelete(habitat.id_habitat)}
                    aria-label="Supprimer l'habitat"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

          {habitats && !habitats.length && (
            <tr>
              <td colSpan="4">
                <p>Pas d'habitat à afficher</p>
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

export default BackHabitat;
