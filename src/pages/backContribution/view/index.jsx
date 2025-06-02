import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams, Link } from "react-router-dom";

import { logger } from "../../../services/logger.service.js";

const BackContributionView = () => {
  const { id_contribution } = useParams();
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [contribution, setContribution] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    logger.info("BackContributionView component mounted", {
      contribution_id: id_contribution,
      admin_id: actualUser?.userId,
    });

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch contribution data
    axios
      .get(`${API_URL}/contribution/readOne/${id_contribution}`)
      .then((response) => {
        setContribution(response.data.contribution);
        logger.info("Contribution loaded for viewing", {
          contribution_id: id_contribution,
          current_validation: response.data.contribution?.validation,
          contribution_name: response.data.contribution?.nom_commun,
          admin_id: actualUser?.userId,
        });
      })
      .catch((error) => {
        logger.error("Failed to load contribution for viewing", {
          contribution_id: id_contribution,
          error: error.message,
          status: error.response?.status,
          admin_id: actualUser?.userId,
        });
        console.error("Error fetching contribution:", error);
        toast.error("Erreur lors du chargement de la contribution");
      });
  }, [id_contribution]);

  const handleValidate = async () => {
    if (actualUser !== undefined && actualUser.role === "admin") {
      logger.info("Admin starting contribution validation", {
        contribution_id: id_contribution,
        admin_id: actualUser.userId,
        contribution_name: contribution.nom_commun,
      });

      setIsValidating(true);
      const API_URL = import.meta.env.VITE_API_URL;

      const data = {
        validation: "1",
      };

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/contribution/validation/${id_contribution}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualUser.token}`,
        },
        data: JSON.stringify(data),
      };

      try {
        const response = await axios.request(config);
        if (response.status === 200) {
          logger.info("Contribution validated successfully by admin", {
            contribution_id: id_contribution,
            admin_id: actualUser.userId,
            contribution_name: contribution.nom_commun,
          });

          toast.success("Contribution validée avec succès");

          // Mettre à jour l'état local
          setContribution((prev) => ({ ...prev, validation: 1 }));
        }
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || "An error occurred"
          : "An error occurred";

        logger.error("Failed to validate contribution", {
          contribution_id: id_contribution,
          error: errorMessage,
          status: error.response?.status,
          admin_id: actualUser.userId,
        });

        toast.error(errorMessage);
      } finally {
        setIsValidating(false);
      }
    } else {
      logger.warn("Unauthorized attempt to validate contribution", {
        contribution_id: id_contribution,
        user_role: actualUser?.role,
        user_id: actualUser?.userId,
      });

      toast.error("Vous ne disposez pas des droits pour cette action");
      navigate("/home");
    }
  };

  const optimizeCloudinaryUrl = (url, width = 400, height = 300) => {
    if (!url) return null;
    if (url.includes("cloudinary.com")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`;
      }
    }
    return url;
  };

  return (
    <div className="main">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Détails de la Contribution</h2>
              <div>
                <span
                  className={`badge fs-6 ${
                    contribution.validation === 1 ? "bg-success" : "bg-warning"
                  }`}
                >
                  {contribution.validation === 1
                    ? "Validée"
                    : "En attente de validation"}
                </span>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h4>Informations générales</h4>
              </div>
              <div className="card-body p-3">
                <div className="row">
                  <div className="col-md-6 ">
                    <p>
                      <strong>ID Contribution:</strong>{" "}
                      {contribution.id_contribution}
                    </p>
                    <p>
                      <strong>Date de création:</strong>{" "}
                      {new Date(
                        contribution.date_creation
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Nom commun:</strong> {contribution.nom_commun}
                    </p>
                    <p>
                      <strong>Nom scientifique:</strong>{" "}
                      {contribution.nom_scientifique}
                    </p>
                    <p>
                      <strong>Taille max:</strong> {contribution.taille_max} cm
                    </p>
                  </div>
                  <div className="col-md-6 ">
                    <p>
                      <strong>Alimentation:</strong> {contribution.alimentation}
                    </p>
                    <p>
                      <strong>Température:</strong> {contribution.temperature}°C
                    </p>
                    <p>
                      <strong>Difficulté:</strong> {contribution.dificulte}
                    </p>
                    <p>
                      <strong>Créé par:</strong>{" "}
                      {contribution.user_pseudo || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <h5>Description</h5>
                  <p className="text-muted">
                    {contribution.description || "Aucune description"}
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            {(contribution.image_1 ||
              contribution.image_2 ||
              contribution.image_3) && (
              <div className="card mt-4">
                <div className="card-header">
                  <h4>Images</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    {contribution.image_1 && (
                      <div className="col-md-4 mb-3">
                        <img
                          src={optimizeCloudinaryUrl(contribution.image_1)}
                          alt="Image 1"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    {contribution.image_2 && (
                      <div className="col-md-4 mb-3">
                        <img
                          src={optimizeCloudinaryUrl(contribution.image_2)}
                          alt="Image 2"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      </div>
                    )}
                    {contribution.image_3 && (
                      <div className="col-md-4 mb-3">
                        <img
                          src={optimizeCloudinaryUrl(contribution.image_3)}
                          alt="Image 3"
                          className="img-fluid rounded"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="d-flex justify-content-between mt-4">
              <Link to="/backContribution" className="btn btn-secondary">
                <i className="bi bi-arrow-left me-2"></i>
                Retour à la liste
              </Link>

              {contribution.validation !== 1 && (
                <button
                  className="btn btn-success"
                  onClick={handleValidate}
                  disabled={isValidating}
                >
                  {isValidating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Validation en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Valider cette contribution
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackContributionView;
