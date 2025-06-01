import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./backCommentaire.css";

const BackCommentaire = () => {
  const [commentaires, setCommentaires] = useState(null);
  console.log(commentaires);
  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3009/commentaire/read",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setCommentaires(response.data.commentaires);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="main">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "5%" }} aria-label="Identifiant du commentaire">
              Id
            </th>
            <th style={{ width: "20%" }} aria-label="Date du commentaire">
              Date
            </th>
            <th style={{ width: "20%" }} aria-label="Validation du commentaire">
              Validation
            </th>
            <th style={{ width: "20%" }} aria-label="Id de l'espèce">
              Id Espèce
            </th>
            <th style={{ width: "20%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {commentaires &&
            commentaires.map((commentaire) => (
              <tr key={commentaire.id_commentaire}>
                <td>{commentaire.id_commentaire}</td>
                <td>{commentaire.date}</td>
                <td>{commentaire.validation}</td>
                <td>{commentaire.id_espece}</td>
                <td>
                  <Link
                    to={`/backCommentaire/update/${commentaire.id_commentaire}`}
                    className="btn btn-primary"
                    aria-label="Editer les commentaires"
                  >
                    Editer
                  </Link>
                </td>
              </tr>
            ))}

          {commentaires && !commentaires.length && (
            <tr>
              <td colSpan="5">
                <p>Pas de commentaires à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link
        to={"/backOffice"}
        className="btn btn-secondary my-4 mx-auto"
        aria-label="Retour à la page d'accueil de l'administration"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default BackCommentaire;
