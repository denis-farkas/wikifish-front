import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const BackHabitatCreate = () => {
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [habitat, setHabitat] = useState({});

  logger.info("BackHabitatCreate component mounted", {
    admin_id: actualUser?.userId,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHabitat((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    logger.debug("Admin editing habitat form", {
      field: name,
      value: value,
      admin_id: actualUser?.userId,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actualUser !== undefined && actualUser.role === "admin") {
      logger.info("Admin starting habitat creation", {
        habitat_name: habitat.libelle,
        admin_id: actualUser.userId,
      });

      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        libelle: habitat.libelle,
        description: habitat.description,
      };
      data = JSON.stringify(data);

      const token = actualUser.token;

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/habitat/create`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 201) {
            logger.info("Habitat created successfully by admin", {
              habitat_name: habitat.libelle,
              habitat_id: response.data?.id_habitat,
              admin_id: actualUser.userId,
            });

            toast.success("Création effectuée avec succès");
            setTimeout(() => {
              navigate("/backHabitat");
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";

          logger.error("Failed to create habitat", {
            habitat_name: habitat.libelle,
            error: errorMessage,
            status: error.response?.status,
            admin_id: actualUser.userId,
          });

          toast.error(errorMessage);
        });
    } else {
      logger.warn("Unauthorized attempt to create habitat", {
        user_role: actualUser?.role,
        user_id: actualUser?.userId,
      });

      const errorMessage =
        "Vous ne disposez pas des droits pour cette modification";
      toast.error(errorMessage);
      navigate("/home");
    }
  };

  return (
    <div className="main">
      <div className="text-center py-4">
        <h2>Nouvel Habitat</h2>
      </div>
      <div className="flex-grow-1">
        <form onSubmit={handleSubmit}>
          <div className="col-sm-6 mx-auto">
            <div className="mt-4">
              <label className="form-label" htmlFor="libelle">
                Libellé
              </label>
              <input
                type="text"
                id="libelle"
                className="form-control"
                name="libelle"
                value={habitat?.libelle || ""}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mt-4">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                name="description"
                rows="4"
                value={habitat?.description || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-primary" type="submit">
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BackHabitatCreate;
