import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./signUp.css";

const SignUp = () => {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const role = "user";
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {
      pseudo,
      email,
      mdp,
      role,
    };
    data = JSON.stringify(data);
    console.log(data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${VITE_API_URL}/users/signUp`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log("Response succeeded!");
          setPseudo("");
          setEmail("");
          setMdp("");

          toast.success("Inscription validée");
          setTimeout(() => {
            navigate("/signIn");
          }, 3000);
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      });
  };
  return (
    <div className="main form-wrapper">
      <h2>Formulaire d&apos;inscription</h2>
      <form className="formGroup" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="pseudo">
            Pseudo
          </label>
          <input
            id="pseudo"
            aria-label="Entrez votre pseudo"
            className="form-control"
            type="text"
            name="pseudo"
            placeholder="Entrez votre pseudo"
            onChange={(e) => {
              setPseudo(e.target.value);
            }}
            required="required"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            aria-label="Entrez votre adresse email"
            className="form-control"
            type="email"
            name="email"
            placeholder="Entrez votre adresse email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required="required"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="mdp">
            Mot de passe
          </label>
          <input
            id="mdp"
            aria-label="Entrez votre mot de passe"
            className="form-control"
            type="password"
            name="mdp"
            placeholder="Entrez un mot de passe (5 caractères minimum)"
            minLength="5"
            onChange={(e) => {
              setMdp(e.target.value);
            }}
            required="required"
          />
        </div>
        <div>
          <input
            className="btn btn-primary"
            type="submit"
            aria-label="S'inscrire"
          />
        </div>
      </form>
    </div>
  );
};

export default SignUp;
