import "./presentation.css";
import { userService } from "../../utils/userService";

const Presentation = () => {
  const isSignedUp = userService.isSignedUp();
  const user = userService.userValue;
  return (
    <section className="presentation container">
      <div className="left">
        <h1 className="title">Le wikipédia des aquariophiles</h1>
        <p>
          Bienvenue sur Wiki Poissons, votre ressource en ligne pour tout ce qui
          concerne les poissons. Explorez notre base de données d'espèces,
          découvrez leurs caractéristiques et apprenez-en plus sur leur habitat.
          Que vous soyez un passionné d'aquariophilie, un étudiant en biologie
          marine ou simplement curieux, vous trouverez ici une mine
          d'informations sur les poissons du monde entier.
        </p>
        <p>
          Rejoignez notre communauté pour partager vos connaissances, poser des
          questions et contribuer à l'enrichissement de notre encyclopédie
          aquatique.
        </p>
        {user && user.pseudo ? (
          <p className="blue-hello">
            Bonjour <span className="green-hello">{user.pseudo}</span>,
            Bienvenue.
          </p>
        ) : isSignedUp ? (
          <a href="/signIn" className="text-white text-decoration-none">
            <button className="btn btn-success">Connexion</button>
          </a>
        ) : (
          <a href="/signUp" className="text-white text-decoration-none">
            <button className="btn btn-success">Inscription</button>
          </a>
        )}
      </div>
      <div className="right">
        <img src="aqua.jpg" alt="Presentation" className="image" />
      </div>
    </section>
  );
};

export default Presentation;
