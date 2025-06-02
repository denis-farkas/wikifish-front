import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const BackHabitatUpdate = () => {
  const { id_habitat } = useParams();

  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [habitat, setHabitat] = useState();

  useEffect(() => {
    logger.info("BackHabitatUpdate component mounted", {
      habitat_id: id_habitat,
      admin_id: actualUser?.userId,
    });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/habitat/readOne/${id_habitat}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setHabitat(response.data.habitat);
        logger.info("Habitat data loaded for editing", {
          habitat_id: id_habitat,
          habitat_name: response.data.habitat?.libelle,
        });
      })
      .catch((error) => {
        logger.error("Failed to load habitat data for editing", {
          habitat_id: id_habitat,
          error: error.message,
          status: error.response?.status,
        });
        console.log(error);
        toast.error("Erreur lors du chargement de l'habitat");
      });
  }, [id_habitat]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "libelle") {
      logger.debug("Admin changing habitat name", {
        habitat_id: id_habitat,
        old_value: habitat?.libelle,
        new_value: value,
      });
    }

    setHabitat((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actualUser !== undefined && actualUser.role === "admin") {
      logger.info("Admin starting habitat update", {
        habitat_id: id_habitat,
        habitat_name: habitat.libelle,
        admin_id: actualUser.userId,
      });

      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        id_habitat: habitat.id_habitat,
        libelle: habitat.libelle,
        description: habitat.description,
      };
      data = JSON.stringify(data);
      const token = actualUser.token;

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/habitat/update/${id_habitat}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 200) {
            logger.info("Habitat updated successfully by admin", {
              habitat_id: id_habitat,
              habitat_name: habitat.libelle,
              admin_id: actualUser.userId,
            });

            toast.success("Modification validée");
            setTimeout(() => {
              navigate("/backHabitat");
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";

          logger.error("Failed to update habitat", {
            habitat_id: id_habitat,
            habitat_name: habitat.libelle,
            error: errorMessage,
            status: error.response?.status,
            admin_id: actualUser.userId,
          });

          toast.error(errorMessage);
        });
    } else {
      logger.warn("Unauthorized attempt to modify habitat", {
        habitat_id: id_habitat,
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
        <h2>Modifier l'Habitat</h2>
      </div>
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
            Modifier
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackHabitatUpdate;
