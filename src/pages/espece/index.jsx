import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// Import component
import Famille from "../../components/famille";
import Habitat from "../../components/habitat";
import Temperament from "../../components/temperament";
import Commentaires from "../../components/commentaires";

// Import CSS
import "./espece.css";

const Espece = () => {
  const { id_espece } = useParams();
  const [espece, setEspece] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Placeholder image for errors
  const placeholderImage =
    "https://res.cloudinary.com/dfmbhkfao/image/upload/v1716664401/fish_species/placeholder_fish_kcwuxn.jpg";

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchEspece = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/espece/readOne/${id_espece}`
        );
        setEspece(response.data.espece);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching espece:", error);
        toast.error("Erreur lors du chargement des données de l'espèce");
        setLoading(false);
      }
    };

    fetchEspece();
  }, [id_espece]);

  // Function to optimize Cloudinary URLs
  const optimizeCloudinaryUrl = (url, width = 400, height = 300) => {
    if (!url) return placeholderImage;

    if (url.includes("cloudinary.com")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`;
      }
    }
    return url;
  };

  // Handle image errors
  const handleImageError = (imageKey) => {
    setImageErrors((prev) => ({
      ...prev,
      [imageKey]: true,
    }));
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!espece) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Espèce non trouvée
        </div>
      </div>
    );
  }

  // Get valid images
  const validImages = [espece.image_1, espece.image_2, espece.image_3].filter(
    (img, index) => img && !imageErrors[`image_${index + 1}`]
  );

  const nextImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
    }
  };

  const prevImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + validImages.length) % validImages.length
      );
    }
  };

  return (
    <div className="container espece-page mt-4">
      <div className="text-center mb-4">
        <h1>{espece.nom_commun}</h1>
        <h3 className="text-muted">{espece.nom_scientifique}</h3>
      </div>

      <div className="row">
        {/* Partie gauche - Composants */}
        <div className="col-md-4">
          <div className="component-container mb-4">
            <h3 className="component-title">Famille</h3>
            <div className="component-content">
              <Famille id_famille={espece.id_famille} />
            </div>
          </div>

          <div className="component-container mb-4">
            <h3 className="component-title">Habitat</h3>
            <div className="component-content">
              <Habitat id_habitat={espece.id_habitat} />
            </div>
          </div>

          <div className="component-container mb-4">
            <h3 className="component-title">Tempérament</h3>
            <div className="component-content">
              <Temperament id_temperament={espece.id_temperament} />
            </div>
          </div>
        </div>

        {/* Partie droite - Images et détails */}
        <div className="col-md-8">
          {/* Galerie d'images */}
          <div className="image-gallery">
            <div className="main-image-container">
              <img
                src={optimizeCloudinaryUrl(
                  validImages[currentImageIndex],
                  800,
                  600
                )}
                alt={`${espece.nom_commun} - Image ${currentImageIndex + 1}`}
                className="main-image"
                onError={() =>
                  handleImageError(`image_${currentImageIndex + 1}`)
                }
              />

              {validImages.length > 1 && (
                <div className="gallery-controls">
                  <button
                    className="gallery-control"
                    onClick={prevImage}
                    aria-label="Image précédente"
                  >
                    <IoChevronBack size={20} />
                  </button>
                  <button
                    className="gallery-control"
                    onClick={nextImage}
                    aria-label="Image suivante"
                  >
                    <IoChevronForward size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {validImages.length > 1 && (
              <div className="thumbnail-container">
                {validImages.map((image, index) => (
                  <img
                    key={index}
                    src={optimizeCloudinaryUrl(image, 150, 100)}
                    alt={`${espece.nom_commun} - Miniature ${index + 1}`}
                    className={`thumbnail ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={() => handleImageError(`image_${index + 1}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Détails de l'espèce */}
          <div className="species-details">
            <h4 className="details-title">Détails de l'Espèce</h4>

            {espece.description && (
              <div className="detail-item">
                <strong className="detail-label">Description:</strong>
                <p className="detail-value">{espece.description}</p>
              </div>
            )}

            {espece.taille_max && (
              <div className="detail-item">
                <strong className="detail-label">Taille Maximum:</strong>
                <p className="detail-value">{espece.taille_max} cm</p>
              </div>
            )}

            {espece.alimentation && (
              <div className="detail-item">
                <strong className="detail-label">Alimentation:</strong>
                <p className="detail-value">{espece.alimentation}</p>
              </div>
            )}

            {espece.temperature && (
              <div className="detail-item">
                <strong className="detail-label">Température:</strong>
                <p className="detail-value">{espece.temperature}°C</p>
              </div>
            )}

            {espece.dificulte && (
              <div className="detail-item">
                <strong className="detail-label">Difficulté:</strong>
                <p className="detail-value">{espece.dificulte}</p>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="text-center mt-4">
            <Link
              to={`/contribution/create/${id_espece}`}
              className="btn btn-primary me-3"
            >
              Contribuer à cette espèce
            </Link>
            <Link to="/especes" className="btn btn-success">
              Retour aux espèces
            </Link>
          </div>
        </div>
      </div>

      {/* Section commentaires */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="comments-section p-4">
            <Commentaires id_espece={id_espece} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Espece;
