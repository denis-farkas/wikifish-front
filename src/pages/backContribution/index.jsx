import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./backContribution.css";

const BackContribution = () => {
  const [contributions, setContributions] = useState(null);
  console.log(contributions);
  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3009/contribution/read",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setContributions(response.data.contributions);
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
            <th
              style={{ width: "5%" }}
              aria-label="Identifiant de la contribution"
            >
              Id
            </th>
            <th style={{ width: "20%" }} aria-label="date de création">
              Date création
            </th>
            <th
              style={{ width: "20%" }}
              aria-label="validation de la contribution"
            >
              Validation
            </th>
            <th style={{ width: "20%" }} aria-label="nom commun">
              Nom commun
            </th>
            <th style={{ width: "20%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {contributions &&
            contributions.map((contribution) => (
              <tr key={contribution.id_contribution}>
                <td>{contribution.id_contribution}</td>
                <td>{contribution.date_creation}</td>
                <td>{contribution.validation}</td>
                <td>{contribution.nom_commun}</td>
                <td>
                  <Link
                    to={`/backContribution/validate/${contribution.id_contribution}`}
                    className="btn btn-primary"
                    aria-label="Valider la contribution"
                  >
                    Valider
                  </Link>
                </td>
              </tr>
            ))}

          {contributions && !contributions.length && (
            <tr>
              <td>
                <p>Pas de contribution à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BackContribution;
