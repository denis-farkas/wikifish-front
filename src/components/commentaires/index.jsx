import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Commentaires = ({ id_espece }) => {
  const [commentaires, setCommentaires] = useState([]);
  const [userCommentaires, setUserCommentaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const actualUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    if (!id_espece) return;
    setLoading(true);

    // Charger les commentaires validés (public, pas d'autorisation nécessaire)
    const loadValidatedComments = fetch(
      `${API_URL}/commentaire/read/${id_espece}`
    )
      .then((res) => res.json())
      .then((data) => {
        const validatedComments = data.commentaires
          ? data.commentaires.filter((comment) => comment.validation === 1)
          : [];
        setCommentaires(validatedComments);
      });

    // Charger les commentaires de l'utilisateur connecté
    const loadUserComments =
      actualUser && actualUser.userId && actualUser.token
        ? fetch(`${API_URL}/commentaire/readByUser/${actualUser.userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${actualUser.token}`,
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => {
              const userSpeciesComments = data.commentaires
                ? data.commentaires.filter(
                    (comment) => comment.id_espece == id_espece
                  )
                : [];
              setUserCommentaires(userSpeciesComments);
            })
            .catch((error) => {
              console.error(
                "Erreur lors du chargement des commentaires utilisateur:",
                error
              );
              setUserCommentaires([]);
            })
        : Promise.resolve();

    Promise.all([loadValidatedComments, loadUserComments]).finally(() =>
      setLoading(false)
    );
  }, [id_espece, actualUser?.userId]);

  const deleteComment = (comment_id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire?")) {
      const API_URL = import.meta.env.VITE_API_URL;

      fetch(`${API_URL}/commentaire/delete/${comment_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualUser.token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setCommentaires(
              commentaires.filter(
                (comment) => comment.id_commentaire !== comment_id
              )
            );
            setUserCommentaires(
              userCommentaires.filter(
                (comment) => comment.id_commentaire !== comment_id
              )
            );
          } else {
            throw new Error("Erreur lors de la suppression");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // Fusionner les commentaires en évitant les doublons
  const mergeComments = () => {
    const allComments = [...commentaires];

    userCommentaires.forEach((userComment) => {
      const exists = allComments.some(
        (comment) => comment.id_commentaire === userComment.id_commentaire
      );
      if (!exists) {
        allComments.push(userComment);
      }
    });

    return allComments.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading)
    return (
      <div className="text-center p-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">
            Chargement des commentaires...
          </span>
        </div>
      </div>
    );

  const allComments = mergeComments();

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Commentaires ({allComments.length})</h3>
        {/* BOUTON UNIQUE - Toujours affiché si l'utilisateur est connecté */}
        {actualUser && (
          <button
            className="btn btn-success"
            onClick={() => navigate(`/commentaire/create/${id_espece}`)}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Ajouter un commentaire
          </button>
        )}
      </div>

      {/* Affichage des commentaires OU message si aucun commentaire */}
      {allComments.length === 0 ? (
        <div className="alert alert-info">
          <p className="mb-0">Aucun commentaire pour cette espèce.</p>
          {!actualUser && (
            <small className="text-muted">
              Connectez-vous pour ajouter le premier commentaire.
            </small>
          )}
        </div>
      ) : (
        <div className="row">
          {allComments.map((commentaire) => {
            const isUserComment =
              actualUser && actualUser.userId === commentaire.user_id;
            const isValidated = commentaire.validation === 1;

            return (
              <div key={commentaire.id_commentaire} className="col-12 mb-3">
                <div className={`card ${!isValidated ? "border-warning" : ""}`}>
                  <div className="card-body">
                    {/* En-tête du commentaire */}
                    <div className="d-flex justify-content-between align-items-start mb-2 p-4">
                      <div>
                        <strong>
                          {commentaire.user_pseudo ||
                            `Utilisateur #${commentaire.user_id}`}
                        </strong>
                        {commentaire.note && (
                          <div className="text-warning">
                            {"★".repeat(commentaire.note)}
                            {"☆".repeat(5 - commentaire.note)}
                            <small className="ms-1">
                              ({commentaire.note}/5)
                            </small>
                          </div>
                        )}
                      </div>
                      <small className="text-muted">
                        {new Date(commentaire.date).toLocaleDateString()}
                      </small>
                    </div>

                    {/* Statut de validation */}
                    {!isValidated && (
                      <div className="alert alert-warning alert-sm mb-2 py-1">
                        <small>
                          <i className="bi bi-clock me-1"></i>
                          En attente de validation
                        </small>
                      </div>
                    )}

                    {/* Contenu du commentaire */}
                    <p className="card-text mb-2 p-4">
                      {commentaire.commentaire}
                    </p>

                    {/* Actions pour l'auteur du commentaire */}
                    {isUserComment && (
                      <div className="mt-2 mx-auto">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => {
                            navigate(
                              `/commentaire/update/${commentaire.id_commentaire}`
                            );
                          }}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Modifier
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                            deleteComment(commentaire.id_commentaire);
                          }}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Commentaires;
