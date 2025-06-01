import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { generateDateTime } from "../../utils/generateDate";

const Contribution = () => {
  const { id_espece } = useParams();
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [espece, setEspece] = useState({});
  const [temperaments, setTemperaments] = useState([]);
  const [familles, setfamilles] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Placeholder image for errors
  const placeholderImage =
    "https://res.cloudinary.com/dfmbhkfao/image/upload/v1716664401/fish_species/placeholder_fish_kcwuxn.jpg";

  // Function to optimize Cloudinary URLs
  const optimizeCloudinaryUrl = (url, width = 400, height = 300) => {
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

  // Handle image errors
  const handleImageError = (imageKey) => {
    setImageErrors((prev) => ({
      ...prev,
      [imageKey]: true,
    }));
  };

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch espece data
    axios
      .get(`${API_URL}/espece/readOne/${id_espece}`)
      .then((response) => {
        const especeData = response.data.espece;
        setEspece(especeData);

        // Set initial image previews from existing data if available
        if (especeData.image_1 && !imageErrors.image_1) {
          setImagePreview1(optimizeCloudinaryUrl(especeData.image_1));
        }
        if (especeData.image_2 && !imageErrors.image_2) {
          setImagePreview2(optimizeCloudinaryUrl(especeData.image_2));
        }
        if (especeData.image_3 && !imageErrors.image_3) {
          setImagePreview3(optimizeCloudinaryUrl(especeData.image_3));
        }
      })
      .catch((error) => console.error("Error fetching espece:", error));

    // Fetch temperaments
    axios
      .get(`${API_URL}/temperament/read`)
      .then((response) => setTemperaments(response.data.temperaments))
      .catch((error) => console.error("Error fetching temperaments:", error));

    // Fetch familles
    axios
      .get(`${API_URL}/famille/read`)
      .then((response) => setfamilles(response.data.familles))
      .catch((error) => console.error("Error fetching familles:", error));

    // Fetch habitats
    axios
      .get(`${API_URL}/habitat/read`)
      .then((response) => setHabitats(response.data.habitats))
      .catch((error) => console.error("Error fetching habitats:", error));
  }, [id_espece]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEspece((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e, setPreview, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      // Reset error for this image
      setImageErrors((prev) => ({
        ...prev,
        [imageKey]: false,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des droits utilisateur
    if (
      !actualUser ||
      (actualUser.role !== "user" && actualUser.role !== "admin")
    ) {
      toast.error("Vous ne disposez pas des droits pour cette contribution");
      navigate("/home");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL;
    const formData = new FormData();

    // Append all text data - CORRECTION : ajout des champs manquants
    formData.append("nom_commun", espece.nom_commun);
    formData.append("nom_scientifique", espece.nom_scientifique);
    formData.append("description", espece.description);
    formData.append("taille_max", espece.taille_max);
    formData.append("alimentation", espece.alimentation);
    formData.append("temperature", espece.temperature);
    formData.append("dificulte", espece.dificulte);
    formData.append("id_temperament", espece.id_temperament);
    formData.append("id_famille", espece.id_famille);
    formData.append("id_habitat", espece.id_habitat);

    // CORRECTION : Ajout des champs requis par le contrôleur
    formData.append("id_espece", id_espece); // Important pour le contrôleur
    formData.append("user_id", actualUser.userId); // Requis par le contrôleur
    formData.append("date_creation", generateDateTime());
    formData.append("cree_le", generateDateTime()); // Requis par le contrôleur
    formData.append("validation", 0); // Par défaut non validé

    // Append images if they exist
    if (e.target.image_1.files[0]) {
      formData.append("image_1", e.target.image_1.files[0]);
    }
    if (e.target.image_2.files[0]) {
      formData.append("image_2", e.target.image_2.files[0]);
    }
    if (e.target.image_3.files[0]) {
      formData.append("image_3", e.target.image_3.files[0]);
    }

    try {
      // CORRECTION : Utiliser POST au lieu de PUT et ajouter l'authentification
      const response = await axios.post(
        `${API_URL}/contribution/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${actualUser.token}`, // Authentification requise
          },
        }
      );

      // CORRECTION : Vérifier le bon status code (201 au lieu de 200)
      if (response.status === 201) {
        toast.success(
          "Contribution effectuée avec succès ! Elle sera examinée par nos modérateurs."
        );
        setTimeout(() => {
          navigate(`/espece/readOne/${id_espece}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Contribution error:", error);
      const errorMessage =
        error.response?.data?.message || "Une erreur s'est produite";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="main-table">
      <div className="center">
        <h2>Contribuer à cette Espèce</h2>
        <p className="text-muted">
          Modifiez les informations de l'espèce : {espece.nom_commun}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="col-sm-8 mx-auto">
          <div className="row">
            <div className="col-md-6">
              <div className="mt-4">
                <label className="form-label">Nom Commun *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nom_commun"
                  value={espece.nom_commun || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="form-label">Nom Scientifique *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nom_scientifique"
                  value={espece.nom_scientifique || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="form-label">Taille Maximum (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  name="taille_max"
                  value={espece.taille_max || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <label className="form-label">Alimentation</label>
                <input
                  type="text"
                  className="form-control"
                  name="alimentation"
                  value={espece.alimentation || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4">
                <label className="form-label">Température (°C)</label>
                <input
                  type="number"
                  className="form-control"
                  name="temperature"
                  value={espece.temperature || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mt-4">
                <label className="form-label">Difficulté</label>
                <select
                  className="form-control"
                  name="dificulte"
                  value={espece.dificulte || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez une difficulté</option>
                  <option value="Debutant">Débutant</option>
                  <option value="Intermediaire">Intermédiaire</option>
                  <option value="Confirme">Confirmé</option>
                </select>
              </div>
              <div className="mt-4">
                <label className="form-label">Tempérament</label>
                <select
                  className="form-control"
                  name="id_temperament"
                  value={espece.id_temperament || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez un tempérament</option>
                  {temperaments.map((temp) => (
                    <option
                      key={temp.id_temperament}
                      value={temp.id_temperament}
                    >
                      {temp.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label className="form-label">Famille</label>
                <select
                  className="form-control"
                  name="id_famille"
                  value={espece.id_famille || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez une famille</option>
                  {familles.map((cat) => (
                    <option key={cat.id_famille} value={cat.id_famille}>
                      {cat.libelle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label className="form-label">Habitat</label>
                <select
                  className="form-control"
                  name="id_habitat"
                  value={espece.id_habitat || ""}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionnez un habitat</option>
                  {habitats.map((hab) => (
                    <option key={hab.id_habitat} value={hab.id_habitat}>
                      {hab.libelle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={espece.description || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Image Section with Cloudinary Optimization */}
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="image-upload-section">
                <label className="form-label">Image 1</label>
                <input
                  type="file"
                  className="form-control"
                  name="image_1"
                  onChange={(e) =>
                    handleImageChange(e, setImagePreview1, "image_1")
                  }
                  accept="image/*"
                />
                {imagePreview1 && (
                  <div className="image-preview mt-2">
                    <img
                      src={imagePreview1}
                      alt="Preview 1"
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                      onError={() => handleImageError("image_1")}
                    />
                  </div>
                )}
                {!imagePreview1 && espece.image_1 && !imageErrors.image_1 && (
                  <div className="current-image mt-2">
                    <small className="text-muted">Image actuelle:</small>
                    <img
                      src={optimizeCloudinaryUrl(espece.image_1, 300, 200)}
                      alt="Image actuelle 1"
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%", maxHeight: "150px" }}
                      onError={() => handleImageError("image_1")}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="image-upload-section">
                <label className="form-label">Image 2 (optionnel)</label>
                <input
                  type="file"
                  className="form-control"
                  name="image_2"
                  onChange={(e) =>
                    handleImageChange(e, setImagePreview2, "image_2")
                  }
                  accept="image/*"
                />
                {imagePreview2 && (
                  <div className="image-preview mt-2">
                    <img
                      src={imagePreview2}
                      alt="Preview 2"
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                      onError={() => handleImageError("image_2")}
                    />
                  </div>
                )}
                {!imagePreview2 && espece.image_2 && !imageErrors.image_2 && (
                  <div className="current-image mt-2">
                    <small className="text-muted">Image actuelle:</small>
                    <img
                      src={optimizeCloudinaryUrl(espece.image_2, 300, 200)}
                      alt="Image actuelle 2"
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%", maxHeight: "150px" }}
                      onError={() => handleImageError("image_2")}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4">
              <div className="image-upload-section">
                <label className="form-label">Image 3 (optionnel)</label>
                <input
                  type="file"
                  className="form-control"
                  name="image_3"
                  onChange={(e) =>
                    handleImageChange(e, setImagePreview3, "image_3")
                  }
                  accept="image/*"
                />
                {imagePreview3 && (
                  <div className="image-preview mt-2">
                    <img
                      src={imagePreview3}
                      alt="Preview 3"
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                      onError={() => handleImageError("image_3")}
                    />
                  </div>
                )}
                {!imagePreview3 && espece.image_3 && !imageErrors.image_3 && (
                  <div className="current-image mt-2">
                    <small className="text-muted">Image actuelle:</small>
                    <img
                      src={optimizeCloudinaryUrl(espece.image_3, 300, 200)}
                      alt="Image actuelle 3"
                      className="img-fluid rounded"
                      style={{ maxWidth: "100%", maxHeight: "150px" }}
                      onError={() => handleImageError("image_3")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="center mt-4">
          <button className="btn btn-primary btn-lg" type="submit">
            <i className="bi bi-check-circle me-2"></i>
            Contribuer
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-lg ms-3"
            onClick={() => navigate(`/espece/${id_espece}`)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contribution;
