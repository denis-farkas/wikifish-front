import "./header.css";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { userService } from "../../utils/userService";
import { useNavigate } from "react-router-dom";

const Header = () => {
  // Utilisation de l'état local pour stocker les informations de l'utilisateur
  const [user, setUser] = useState(null);

  // Utilisation du hook useNavigate pour la navigation dans l'application React Router
  const navigate = useNavigate();
  userService.setNavigate(navigate);

  // Fonction de déconnexion de l'utilisateur
  const logout = () => {
    userService.logout();
  };

  // Utilisation du hook useEffect pour souscrire aux changements de l'utilisateur
  useEffect(() => {
    // Abonnement aux mises à jour de l'utilisateur à l'aide du service userService
    const subscription = userService.user.subscribe((x) => setUser(x));

    // Nettoyage de l'abonnement lors de la destruction du composant
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white" data-bs-theme="white">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <img src="/logo.png" className="logo-img" />
            <span className="logo-title">WIKIPOISSONS</span>
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav ms-auto w-75">
              <li className="nav-item">
                <NavLink className="nav-link active" to="/">
                  Accueil
                  <span className="visually-hidden">(current)</span>
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Profil
                </a>
                <div className="dropdown-menu">
                  <NavLink className="nav-link active" to="/">
                    Accueil
                    <span className="visually-hidden">(current)</span>
                  </NavLink>

                  {user ? (
                    <>
                      <NavLink
                        to={"/userProfile"}
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        role="menuitem"
                      >
                        Mon compte
                      </NavLink>

                      <NavLink
                        to="/"
                        onClick={logout}
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        role="menuitem"
                      >
                        Se déconnecter
                      </NavLink>
                      <NavLink
                        to={"/search-history"}
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        role="menuitem"
                      >
                        <i className="bi bi-clock-history me-1"></i>
                        Historique de recherche
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to={"/signUp"}
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        role="menuitem"
                      >
                        Inscription
                      </NavLink>
                      <NavLink
                        to={"/signIn"}
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        role="menuitem"
                      >
                        Connexion
                      </NavLink>
                    </>
                  )}

                  {/* Condition pour afficher le lien vers l'espace admin pour les utilisateurs ayant le rôle "admin" */}
                  {user && user.role === "admin" && (
                    <NavLink
                      to={"/backOffice"}
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      Espace Admin
                    </NavLink>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Header;
