import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const BackFamilleUpdate = () => {
  const { id_famille } = useParams();

  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [famille, setFamille] = useState();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}/famille/readOne/${id_famille}`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {
        setFamille(response.data.famille);
      })
      .catch((error) => {
        console.error("Error fetching famille:", error);
        toast.error("Erreur lors du chargement de la famille");
      });
  }, [id_famille]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFamille((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actualUser !== undefined && actualUser.role === "admin") {
      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        id_famille: famille.id_famille,
        libelle: famille.libelle,
        description: famille.description,
      };
      data = JSON.stringify(data);
      const token = actualUser.token;

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/famille/update/${famille.id_famille}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Modification validée");
            setTimeout(() => {
              navigate("/backFamille");
            }, 3000);
          }
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message || "An error occurred"
            : "An error occurred";
          toast.error(errorMessage);
        });
    } else {
      const errorMessage =
        "Vous ne disposez pas des droits pour cette modification";
      toast.error(errorMessage);
      navigate("/home");
    }
  };

  return (
    <div className="main">
      <div className="text-center py-4">
        <h2>Modifier la Famille</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-sm-6 mx-auto">
          <div className="mt-4">
            <label className="form-label" htmlFor="libelle">
              Libellé
            </label>
            <input
              type="text"
              id="libelle"
              className="form-control"
              name="libelle"
              value={famille?.libelle || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="form-control"
              name="description"
              rows="4"
              value={famille?.description || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary" type="submit">
            Modifier
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackFamilleUpdate;
