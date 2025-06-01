import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { userService } from "../../utils/userService";
import "./signIn.css";

const SignIn = () => {
  //const { email, password }

  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = { email, mdp };
    data = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${VITE_API_URL}/users/signIn`,
      headers: {
        "Content-Type": "application/json",
      },

      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.status === 200) {
          console.log("Response succeeded!");
          userService.login(response.data.user);
          setEmail("");
          setMdp("");
          toast.success("Connecté");
          setTimeout(() => {
            navigate("/");
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
      <h2>Formulaire de connexion</h2>

      <form className="formGroup" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" for="email">
            Email
          </label>
          <input
            id="email"
            aria-label="Entrez votre adresse email"
            className="form-control"
            type="email"
            name="email"
            placeholder="Veuillez entrez votre adresse email"
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
            placeholder="Veuillez entrez votre mot de passe"
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
            aria-label="Se connecter"
          />
        </div>
      </form>
    </div>
  );
};

export default SignIn;
