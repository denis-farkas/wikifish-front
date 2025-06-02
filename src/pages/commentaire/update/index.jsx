import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const CommentaireUpdate = () => {
  const { id_commentaire } = useParams();
  const navigate = useNavigate();

  const [commentaire, setCommentaire] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Déplacer actualUser DANS le useEffect pour éviter les re-renders
    const actualUser = JSON.parse(localStorage.getItem("user"));

    logger.info("CommentaireUpdate component mounted - User editing comment", {
      comment_id: id_commentaire,
      user_id: actualUser?.userId,
    });

    const fetchCommentaire = async () => {
      try {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${import.meta.env.VITE_API_URL}/commentaire/${id_commentaire}`,
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.request(config);
        setCommentaire(response.data.commentaire);

        logger.info("Comment data loaded for editing", {
          comment_id: id_commentaire,
          species_id: response.data.commentaire?.id_espece,
          original_rating: response.data.commentaire?.note,
          user_id: actualUser?.userId,
        });

        // Vérification des droits APRÈS avoir récupéré les données
        if (
          !actualUser ||
          actualUser.userId !== response.data.commentaire.user_id
        ) {
          logger.warn("Unauthorized attempt to edit comment", {
            comment_id: id_commentaire,
            comment_owner: response.data.commentaire.user_id,
            attempted_by: actualUser?.userId,
          });

          toast.error(
            "Vous ne disposez pas des droits pour cette modification"
          );
          navigate("/home");
          return;
        }
      } catch (error) {
        logger.error("Failed to load comment data for editing", {
          comment_id: id_commentaire,
          error: error.message,
          status: error.response?.status,
          user_id: actualUser?.userId,
        });

        console.log(error);
        toast.error("Erreur lors du chargement du commentaire");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentaire();
  }, [id_commentaire, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "note") {
      logger.debug("User changing comment rating", {
        comment_id: id_commentaire,
        old_rating: commentaire?.note,
        new_rating: value,
        user_id: JSON.parse(localStorage.getItem("user"))?.userId,
      });
    }

    setCommentaire((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Récupérer actualUser au moment de la soumission
    const actualUser = JSON.parse(localStorage.getItem("user"));

    // Vérification supplémentaire lors de la soumission
    if (!actualUser || actualUser.userId !== commentaire?.user_id) {
      logger.warn("Unauthorized attempt to submit comment update", {
        comment_id: id_commentaire,
        comment_owner: commentaire?.user_id,
        attempted_by: actualUser?.userId,
      });

      toast.error("Vous ne disposez pas des droits pour cette modification");
      navigate("/home");
      return;
    }

    logger.info("User submitting comment update", {
      comment_id: id_commentaire,
      species_id: commentaire.id_espece,
      new_rating: commentaire.note,
      comment_length: commentaire.commentaire?.length || 0,
      user_id: actualUser.userId,
    });

    const API_URL = import.meta.env.VITE_API_URL;

    let data = {
      id_commentaire,
      user_id: actualUser.userId,
      id_espece: commentaire.id_espece,
      note: commentaire.note,
      commentaire: commentaire.commentaire,
      validation: false,
    };
    data = JSON.stringify(data);

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${API_URL}/commentaire/update/${id_commentaire}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          logger.info("Comment updated successfully by user", {
            comment_id: id_commentaire,
            species_id: commentaire.id_espece,
            new_rating: commentaire.note,
            user_id: actualUser.userId,
            awaiting_validation: true,
          });

          toast.success("Modification validée");
          setTimeout(() => {
            navigate("/espece/readOne/" + commentaire.id_espece);
          }, 3000);
        }
      })
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data.message || "An error occurred"
          : "An error occurred";

        logger.error("Failed to update comment", {
          comment_id: id_commentaire,
          species_id: commentaire.id_espece,
          error: errorMessage,
          status: error.response?.status,
          user_id: actualUser.userId,
        });

        toast.error(errorMessage);
      });
  };

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="main-table">
        <div className="center">
          <h2>Chargement...</h2>
        </div>
      </div>
    );
  }

  // Si pas de commentaire après chargement
  if (!commentaire) {
    return null;
  }

  return (
    <div className="main-table">
      <div className="center">
        <h2>Modifier le Commentaire</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-sm-6 mx-auto">
          <label className="form-label mt-4">Note</label>
          <div className="d-flex justify-content-between">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="note"
                  id={`note${value}`}
                  value={value}
                  checked={commentaire && commentaire.note === value.toString()}
                  onChange={handleInputChange}
                  required
                />
                <label className="form-check-label" htmlFor={`note${value}`}>
                  {value}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="form-label" htmlFor="commentaire">
              Commentaire
            </label>
            <textarea
              id="commentaire"
              className="form-control"
              name="commentaire"
              rows="4"
              placeholder="Écrivez votre commentaire ici"
              value={commentaire?.commentaire || ""}
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

export default CommentaireUpdate;
