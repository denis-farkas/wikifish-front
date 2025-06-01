import { Link } from "react-router-dom";
import { useState } from "react";
import "./especeCard.css";

const EspeceCard = ({ espece }) => {
  // Placeholder image for errors
  const placeholderImage =
    "https://res.cloudinary.com/dfmbhkfao/image/upload/v1716664401/fish_species/placeholder_fish_kcwuxn.jpg";

  // Track loading errors
  const [imageErrors, setImageErrors] = useState({});

  // Handle both single image_url or multiple images in an array
  const image_1 = espece.image_1;
  const image_2 = espece.image_2;
  const image_3 = espece.image_3;

  // Function to optimize Cloudinary URLs
  const optimizeCloudinaryUrl = (url, width = 220, height = 180) => {
    if (!url) return placeholderImage;

    // Check if it's a Cloudinary URL
    if (url.includes("cloudinary.com")) {
      // Parse the URL to insert transformation parameters
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        // Add auto format, quality, and resize transformations
        return `${parts[0]}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${parts[1]}`;
      }
    }

    // Return original URL if not Cloudinary or can't be parsed
    return url;
  };

  // Handle image loading errors
  const handleImageError = (index) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  // Build the images array with error handling
  const images = [];
  if (image_1 && !imageErrors[0]) images.push(optimizeCloudinaryUrl(image_1));
  if (image_2 && !imageErrors[1]) images.push(optimizeCloudinaryUrl(image_2));
  if (image_3 && !imageErrors[2]) images.push(optimizeCloudinaryUrl(image_3));

  // Fallback if no images at all
  if (!images.length) {
    images.push(placeholderImage);
  }

  const carouselId = `carousel-${espece.id_espece}`;

  return (
    <div className="espece-card">
      <div className="espece-image">
        {images.length === 1 ? (
          // Single image, no carousel needed
          <img
            src={images[0]}
            alt={espece.nom_commun || "Espèce de poisson"}
            className="card-img"
            loading="lazy"
            onError={() => handleImageError(0)}
          />
        ) : (
          // Multiple images, use carousel
          <div
            id={carouselId}
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={img}
                    className="d-block w-100 card-img"
                    alt={`${espece.nom_commun || "Espèce"} - image ${
                      index + 1
                    }`}
                    loading="lazy"
                    onError={() => handleImageError(index)}
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target={`#${carouselId}`}
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Précédent</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target={`#${carouselId}`}
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Suivant</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="espece-details">
        <h3 className="espece-title">{espece.nom_commun || espece.libelle}</h3>
        <p className="espece-scientific-name">{espece.nom_scientifique}</p>
        <Link
          to={`/espece/readOne/${espece.id_espece}`}
          className="btn btn-primary btn-sm"
        >
          Voir détails
        </Link>
      </div>
    </div>
  );
};

export default EspeceCard;
