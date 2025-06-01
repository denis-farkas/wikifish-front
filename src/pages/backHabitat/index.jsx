import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./backHabitat.css";

const BackHabitat = () => {
  const [habitats, setHabitats] = useState(null);
  console.log(habitats);
  useEffect(() => {
    let data;

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:3009/habitat/read",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setHabitats(response.data.habitats);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleDelete = (id_habitat) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet habitat ?")) {
      const actualUser = JSON.parse(localStorage.getItem("user"));

      if (!actualUser || actualUser.role !== "admin") {
        toast.error("Vous n'avez pas les droits pour effectuer cette action");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3009";
      const token = actualUser.token;

      let config = {
        method: "delete",
        url: `${API_URL}/habitat/delete/${id_habitat}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Habitat supprimé avec succès");
            // Update state to remove the deleted habitat
            setHabitats(
              habitats.filter((habitat) => habitat.id_habitat !== id_habitat)
            );
          }
        })
        .catch((error) => {
          console.error(error);
          const errorMessage = error.response
            ? error.response.data.message || "Une erreur est survenue"
            : "Une erreur est survenue";
          toast.error(errorMessage);
        });
    }
  };
  return (
    <div className="main text-center">
      <h1>Familles</h1>
      <Link to="/backHabitat/create" className="btn btn-success my-4 ">
        Créer habitat
      </Link>
      <table className="table my-5">
        <thead>
          <tr>
            <th style={{ width: "5%" }} aria-label="Identifiant de la habitat">
              Id
            </th>

            <th style={{ width: "30%" }} aria-label="Libellé de l'habitat">
              Libellé
            </th>
            <th style={{ width: "30%" }} aria-label="Description de l'habitat">
              Description
            </th>
            <th style={{ width: "30%" }} aria-label="Actions">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {habitats &&
            habitats.map((habitat) => (
              <tr key={habitat.id_habitat}>
                <td>{habitat.id_habitat}</td>
                <td>{habitat.libelle}</td>
                <td>{habitat.description}</td>
                <td>
                  <Link
                    to={`/backHabitat/update/${habitat.id_habitat}`}
                    className="btn btn-primary"
                    aria-label="Editer l'habitat"
                  >
                    Editer
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => handleDelete(habitat.id_habitat)}
                    aria-label="Supprimer l'habitat"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}

          {habitats && !habitats.length && (
            <tr>
              <td>
                <p>Pas d'habitat à afficher</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BackHabitat;
