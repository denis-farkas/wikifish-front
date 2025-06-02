import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const BackCommentaireUpdate = () => {
  const { id_commentaire } = useParams();

  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [commentaire, setCommentaire] = useState();

  useEffect(() => {
    logger.info("BackCommentaireUpdate component mounted", {
      comment_id: id_commentaire,
      admin_id: actualUser?.userId,
    });

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/commentaire/${id_commentaire}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then((response) => {
        setCommentaire(response.data.commentaire);
        logger.info("Comment loaded for admin editing", {
          comment_id: id_commentaire,
          current_validation: response.data.commentaire?.validation,
        });
      })
      .catch((error) => {
        logger.error("Failed to load comment for admin editing", {
          comment_id: id_commentaire,
          error: error.message,
          status: error.response?.status,
        });
        console.log(error);
      });
  }, [id_commentaire]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "validation") {
      logger.debug("Admin changing comment validation status", {
        comment_id: id_commentaire,
        old_value: commentaire?.validation,
        new_value: value,
      });
    }

    setCommentaire((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (actualUser !== undefined && actualUser.role === "admin") {
      logger.info("Admin starting comment validation update", {
        comment_id: id_commentaire,
        new_validation: commentaire.validation,
        admin_id: actualUser.userId,
      });

      const API_URL = import.meta.env.VITE_API_URL;

      let data = {
        id_commentaire: id_commentaire,
        validation: commentaire.validation,
      };
      data = JSON.stringify(data);

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/commentaire/updateValidation/${id_commentaire}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualUser.token}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 200) {
            logger.info("Comment validation updated successfully by admin", {
              comment_id: id_commentaire,
              validation_status: commentaire.validation,
              admin_id: actualUser.userId,
            });

            toast.success("Modification validée");
            setTimeout(() => {
              navigate("/backCommentaire");
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";

          logger.error("Failed to update comment validation", {
            comment_id: id_commentaire,
            error: errorMessage,
            status: error.response?.status,
            admin_id: actualUser.userId,
          });

          toast.error(errorMessage);
        });
    } else {
      logger.warn("Unauthorized attempt to modify comment validation", {
        comment_id: id_commentaire,
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
        <h2>Modifier le Commentaire</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-sm-6 mx-auto">
          <div className="mt-4">
            <label className="form-label" htmlFor="commentaire">
              Commentaire
            </label>
            <textarea
              id="commentaire"
              className="form-control"
              name="commentaire"
              rows="4"
              value={commentaire?.commentaire || ""}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className="mt-4">
            <label className="form-label" htmlFor="validation">
              Validation
            </label>
            <input
              type="number"
              className="form-control"
              name="validation"
              value={commentaire?.validation || ""}
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

export default BackCommentaireUpdate;
