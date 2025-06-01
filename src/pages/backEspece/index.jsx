import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./backEspece.css";

const BackEspece = () => {
  const [especes, setEspeces] = useState(null);
  console.log(especes);
  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3009/espece/read",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setEspeces(response.data.especes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="main">
      <h1>Espéces</h1>
      <Link to="/backEspece/create" className="btn btn-success my-4">
        Créer espéce
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "5%" }} aria-label="Identifiant de l'espece">
              Id
            </th>

            <th style={{ width: "30%" }} aria-label="nom_commun de l'espece">
              nom_commun
            </th>
            <th style={{ width: "30%" }} aria-label="cree_le de l'espece">
              cree_le
            </th>
            <th style={{ width: "30%" }} aria-label="modifie_le de l'espece">
              modifie_le
            </th>
            <th style={{ width: "30%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {especes &&
            especes.map((espece) => (
              <tr key={espece.espece_id}>
                <td>{espece.espece_id}</td>
                <td>{espece.nom_commun}</td>
                <td>{espece.cree_le}</td>
                <td>{espece.modifie_le}</td>
                <td>
                  <Link
                    to={`/backEspece/update/${espece.id_espece}`}
                    className="btn btn-primary"
                    aria-label="Editer l'espéce"
                  >
                    Editer
                  </Link>
                </td>
              </tr>
            ))}

          {especes && !especes.length && (
            <tr>
              <td>
                <p>Pas de espece à afficher</p>
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

export default BackEspece;
