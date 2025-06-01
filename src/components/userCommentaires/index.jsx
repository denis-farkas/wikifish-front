import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { formatDateTime } from "../../utils/generateDate";

const UserCommentaires = () => {
  const [commentaires, setCommentaires] = useState(null);
  console.log(commentaires);
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const userId = actualUser.userId;
  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `http://localhost:3009/commentaire/readByUser/${userId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${actualUser.token}`,
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
            <th style={{ width: "20%" }} aria-label="date de création">
              Date création
            </th>
            <th
              style={{ width: "20%" }}
              aria-label="validation de la commentaire"
            >
              Validation
            </th>
            <th style={{ width: "20%" }} aria-label="id espece">
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
                <td>{formatDateTime(commentaire.date)}</td>
                <td>{commentaire.validation}</td>
                <td>{commentaire.id_espece}</td>
                <td>
                  <Link
                    to={`/commentaire/update/${commentaire.id_commentaire}`}
                    className="btn btn-primary"
                    aria-label="Editer le commentaire"
                  >
                    Editer
                  </Link>
                </td>
              </tr>
            ))}

          {commentaires && !commentaires.length && (
            <tr>
              <td>
                <p>Pas de commentaire à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserCommentaires;
