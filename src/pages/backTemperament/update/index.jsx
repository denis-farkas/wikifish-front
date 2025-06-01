import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const BackTemperamentUpdate = () => {
  const { id_temperament } = useParams();

  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [temperament, setTemperament] = useState();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${API_URL}/temperament/readOne/${id_temperament}`,
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response);
        setTemperament(response.data.temperament);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id_temperament]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemperament((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(temperament);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actualUser !== undefined && actualUser.role === "admin") {
      const API_URL = import.meta.env.VITE_API_URL;
      let data = {
        id_temperament: temperament.id_temperament,
        libelle: temperament.libelle,
        description: temperament.description,
      };
      data = JSON.stringify(data);
      const token = actualUser.token;
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/temperament/update/${temperament.id_temperament}`,
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
              navigate("/backTemperament");
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
    <div className="main-table">
      <div className="center">
        <h2>Modifier le Tempérament</h2>
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
              value={temperament?.libelle || ""}
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
              value={temperament?.description || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="center mt-4">
          <button className="btn btn-primary" type="submit">
            Modifier
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackTemperamentUpdate;
