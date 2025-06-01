import { Link } from "react-router-dom";
import "./backOffice.css";

const BackOffice = () => {
    return (
        <div className="main">
            <div className="jumbotron">
                <Link to={"/backUser"} aria-label="Accéder à la gestion des membres">
                    <button className="button back">Gestion des membres</button>
                </Link>
                <Link to={"/backEspece"} aria-label="Accéder à la gestion des espèces">
                        <button className="button back">Gestion des espèces</button>
                    </Link>

                <Link to={"/backHabitat"} aria-label="Accéder à la gestion des habitats">
                        <button className="button back">Gestion des habitats</button>
                    </Link>

                <Link to={"/backFamille"} aria-label="Accéder à la gestion des familles">
                        <button className="button back">Gestion des familles</button>
                    </Link>

                <Link to={"/backTemperament"} aria-label="Accéder à la gestion des tempéraments">
                        <button className="button back">Gestion des tempéraments</button>
                    </Link>

                <Link to={"/backContribution"} aria-label="Accéder à la gestion des contributions">
                        <button className="button back">Gestion des contributions</button>
                    </Link>

                <Link to={"/backCommentaire"} aria-label="Accéder à la gestion des commentaires">
                        <button className="button back">Gestion des commentaires</button>
                    </Link> 
            </div>
        </div>
    );
};

export default BackOffice;
