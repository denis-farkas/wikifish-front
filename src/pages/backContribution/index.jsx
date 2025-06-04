import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { logger } from "../../services/logger.service.js";
import "./backContribution.css";

const BackContribution = () => {
  const [contributions, setContributions] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    logger.info(
      "BackContribution component mounted - Admin accessing contributions management"
    );

    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}/contribution/read`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setContributions(response.data.contributions);
        logger.info("Contributions loaded successfully for admin", {
          count: response.data.contributions?.length || 0,
        });
      })
      .catch((error) => {
        logger.error("Failed to load contributions for admin", {
          error: error.message,
          status: error.response?.status,
          url: config.url,
        });
        console.log(error);
      });
  }, []);

  const handleViewClick = (contributionId) => {
    logger.info("Admin navigating to view contribution", {
      contribution_id: contributionId,
    });
  };

  const handleBackToOffice = () => {
    logger.info("Admin returning to back office from contributions management");
  };

  return (
    <div className="main">
      <h1>Contributions</h1>
      <table className="table">
        <thead>
          <tr>
            <th
              style={{ width: "5%" }}
              aria-label="Identifiant de la contribution"
            >
              Id
            </th>
            <th style={{ width: "20%" }} aria-label="date de création">
              Date création
            </th>
            <th
              style={{ width: "15%" }}
              aria-label="validation de la contribution"
            >
              Validation
            </th>
            <th style={{ width: "25%" }} aria-label="nom commun">
              Nom commun
            </th>
            <th style={{ width: "20%" }} aria-label="Utilisateur">
              Utilisateur
            </th>
            <th style={{ width: "15%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {contributions &&
            contributions.map((contribution) => (
              <tr key={contribution.id_contribution}>
                <td>{contribution.id_contribution}</td>
                <td>
                  {new Date(contribution.date_creation).toLocaleDateString()}
                </td>
                <td>
                  <span
                    className={`badge ${
                      contribution.validation === 1
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {contribution.validation === 1 ? "Validée" : "En attente"}
                  </span>
                </td>
                <td>{contribution.nom_commun}</td>
                <td>{contribution.user_id || "N/A"}</td>
                <td>
                  <Link
                    to={`/backContribution/view/${contribution.id_contribution}`}
                    className="btn btn-primary btn-sm"
                    aria-label="Voir la contribution"
                    onClick={() =>
                      handleViewClick(contribution.id_contribution)
                    }
                  >
                    Voir
                  </Link>
                </td>
              </tr>
            ))}

          {contributions && !contributions.length && (
            <tr>
              <td colSpan="6">
                <p>Pas de contribution à afficher</p>
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

export default BackContribution;
