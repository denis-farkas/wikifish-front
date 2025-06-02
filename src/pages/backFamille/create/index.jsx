import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const BackFamilleCreate = () => {
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [famille, setFamille] = useState({});

  logger.info("BackFamilleCreate component mounted", {
    admin_id: actualUser?.userId,
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamille((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    logger.debug("Admin editing family form", {
      field: name,
      value: value,
      admin_id: actualUser?.userId,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actualUser !== undefined && actualUser.role === "admin") {
      logger.info("Admin starting family creation", {
        family_name: famille.libelle,
        admin_id: actualUser.userId,
      });

      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        libelle: famille.libelle,
        description: famille.description,
      };
      data = JSON.stringify(data);
      const token = actualUser.token;

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/famille/create`,
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
            logger.info("Family created successfully by admin", {
              family_name: famille.libelle,
              family_id: response.data?.id_famille,
              admin_id: actualUser.userId,
            });

            toast.success("Création effectuée avec succès");
            setTimeout(() => {
              navigate("/backFamille");
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";

          logger.error("Failed to create family", {
            family_name: famille.libelle,
            error: errorMessage,
            status: error.response?.status,
            admin_id: actualUser.userId,
          });

          toast.error(errorMessage);
        });
    } else {
      logger.warn("Unauthorized attempt to create family", {
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
        <h2>Nouvelle Famille</h2>
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
              value={famille?.libelle || ""}
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
              value={famille?.description || ""}
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

export default BackFamilleCreate;
