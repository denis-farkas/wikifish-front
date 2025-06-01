import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./backUser.css";

const BackUser = () => {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/users/read`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setUsers(response.data.users);
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
              aria-label="Identifiant de l'utilisateur"
            >
              Id
            </th>

            <th style={{ width: "30%" }} aria-label="Pseudo de l'utilisateur">
              Pseudo
            </th>
            <th style={{ width: "30%" }} aria-label="Email de l'utilisateur">
              Email
            </th>
            <th style={{ width: "30%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.pseudo}</td>
                <td>{user.email}</td>
                <td>
                  <Link
                    to={`/userProfile/readOne/${user.user_id}`}
                    className="btn btn-primary"
                    aria-label="Editer les utilisateurs"
                  >
                    Editer
                  </Link>
                </td>
              </tr>
            ))}

          {users && !users.length && (
            <tr>
              <td>
                <p>Pas de membres à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BackUser;
