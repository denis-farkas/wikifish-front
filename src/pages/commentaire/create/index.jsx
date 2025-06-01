import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { generateDateTime } from "../../../utils/generateDate";

const CommentaireCreate = () => {
  const { id_espece } = useParams();
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [commentaire, setCommentaire] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false); // État pour empêcher les soumissions multiples

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommentaire((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(commentaire);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Empêcher les soumissions multiples
    if (isSubmitting) {
      toast.warning("Création en cours, veuillez patienter...");
      return;
    }

    if (actualUser !== undefined) {
      setIsSubmitting(true); // Désactive le bouton et empêche les soumissions multiples

      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        note: commentaire.note,
        commentaire: commentaire.commentaire,
        date: generateDateTime(),
        validation: false,
        user_id: actualUser.userId,
        id_espece: id_espece,
      };
      data = JSON.stringify(data);

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${API_URL}/commentaire/create`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            toast.success("Création effectuée avec succès");
            setTimeout(() => {
              navigate("/espece/readOne/" + id_espece); // Correction: utiliser id_espece au lieu de commentaire.id_espece
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";
          toast.error(errorMessage);
        })
        .finally(() => {
          setIsSubmitting(false); // Réactive le bouton après la réponse
        });
    } else {
      const errorMessage =
        "Vous ne disposez pas des droits pour cet ajout, Veuillez vous connecter";
      toast.error(errorMessage);
      navigate("/");
    }
  };

  return (
    <div className="main-table">
      <div className="center">
        <h2>Nouveau Commentaire</h2>
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
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting} // Désactive les inputs pendant la soumission
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
              disabled={isSubmitting} // Désactive le textarea pendant la soumission
              required
            />
          </div>
        </div>
        <div className="center mt-4">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isSubmitting} // Désactive le bouton pendant la soumission
          >
            {isSubmitting ? "Création en cours..." : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentaireCreate;
