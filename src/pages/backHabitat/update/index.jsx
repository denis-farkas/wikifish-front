import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const BackHabitatUpdate = () => {
  const { id_habitat } = useParams();

  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [habitat, setHabitat] = useState();

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${import.meta.env.VITE_API_URL}/habitat/readOne/${id_habitat}`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response);
        setHabitat(response.data.habitat);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id_habitat]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHabitat((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(habitat);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actualUser !== undefined && actualUser.role === "admin") {
      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        id_habitat: habitat.id_habitat,
        libelle: habitat.libelle,
        description: habitat.description,
      };
      data = JSON.stringify(data);
      const token = actualUser.token;

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/habitat/update/${id_habitat}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success("Modification validée");
            setTimeout(() => {
              navigate("/backHabitat");
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
        <h2>Modifier l'Habitat</h2>
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
              value={habitat?.libelle || ""}
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
              value={habitat?.description || ""}
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

export default BackHabitatUpdate;
