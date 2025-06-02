import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const BackTemperamentCreate = () => {
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [temperament, setTemperament] = useState({});

  logger.info("BackTemperamentCreate component mounted", {
    admin_id: actualUser?.userId,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemperament((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    logger.debug("Admin editing temperament form", {
      field: name,
      value: value,
      admin_id: actualUser?.userId,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actualUser !== undefined && actualUser.role === "admin") {
      logger.info("Admin starting temperament creation", {
        temperament_name: temperament.libelle,
        admin_id: actualUser.userId,
      });

      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        libelle: temperament.libelle,
        description: temperament.description,
      };
      data = JSON.stringify(data);
      const token = actualUser.token;

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/temperament/create`,
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
            logger.info("Temperament created successfully by admin", {
              temperament_name: temperament.libelle,
              temperament_id: response.data?.id_temperament,
              admin_id: actualUser.userId,
            });

            toast.success("Création effectuée avec succès");
            setTimeout(() => {
              navigate("/backTemperament");
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";

          logger.error("Failed to create temperament", {
            temperament_name: temperament.libelle,
            error: errorMessage,
            status: error.response?.status,
            admin_id: actualUser.userId,
          });

          toast.error(errorMessage);
        });
    } else {
      logger.warn("Unauthorized attempt to create temperament", {
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
    <div className="main-table">
      <div className="center">
        <h2>Nouveau Tempérament</h2>
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
              value={temperament?.libelle || ""}
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
              value={temperament?.description || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="center mt-4">
          <button className="btn btn-primary" type="submit">
            Créer
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackTemperamentCreate;
