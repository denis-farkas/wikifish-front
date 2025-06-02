import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const BackTemperamentUpdate = () => {
  const { id_temperament } = useParams();

  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [temperament, setTemperament] = useState();

  useEffect(() => {
    logger.info("BackTemperamentUpdate component mounted", {
      temperament_id: id_temperament,
      admin_id: actualUser?.userId,
    });

    const API_URL = import.meta.env.VITE_API_URL;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}/temperament/readOne/${id_temperament}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setTemperament(response.data.temperament);
        logger.info("Temperament data loaded for editing", {
          temperament_id: id_temperament,
          temperament_name: response.data.temperament?.libelle,
        });
      })
      .catch((error) => {
        logger.error("Failed to load temperament data for editing", {
          temperament_id: id_temperament,
          error: error.message,
          status: error.response?.status,
        });
        console.log(error);
        toast.error("Erreur lors du chargement du tempérament");
      });
  }, [id_temperament]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "libelle") {
      logger.debug("Admin changing temperament name", {
        temperament_id: id_temperament,
        old_value: temperament?.libelle,
        new_value: value,
      });
    }

    setTemperament((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actualUser !== undefined && actualUser.role === "admin") {
      logger.info("Admin starting temperament update", {
        temperament_id: id_temperament,
        temperament_name: temperament.libelle,
        admin_id: actualUser.userId,
      });

      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        id_temperament: temperament.id_temperament,
        libelle: temperament.libelle,
        description: temperament.description,
      };
      data = JSON.stringify(data);
      const token = actualUser.token;

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/temperament/update/${temperament.id_temperament}`,
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
            logger.info("Temperament updated successfully by admin", {
              temperament_id: id_temperament,
              temperament_name: temperament.libelle,
              admin_id: actualUser.userId,
            });

            toast.success("Modification validée");
            setTimeout(() => {
              navigate("/backTemperament");
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";

          logger.error("Failed to update temperament", {
            temperament_id: id_temperament,
            temperament_name: temperament.libelle,
            error: errorMessage,
            status: error.response?.status,
            admin_id: actualUser.userId,
          });

          toast.error(errorMessage);
        });
    } else {
      logger.warn("Unauthorized attempt to modify temperament", {
        temperament_id: id_temperament,
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
        <h2>Modifier le Tempérament</h2>
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
            Modifier
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackTemperamentUpdate;
