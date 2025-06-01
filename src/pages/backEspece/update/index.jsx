import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { generateDateTime } from "../../../utils/generateDate";

const BackEspeceUpdate = () => {
  const { id_espece } = useParams();
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [espece, setEspece] = useState({});
  const [temperaments, setTemperaments] = useState([]);
  const [familles, setFamilles] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);
  const [imageFile1, setImageFile1] = useState(null);
  const [imageFile2, setImageFile2] = useState(null);
  const [imageFile3, setImageFile3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Cloudinary configuration
  const CLOUDINARY_UPLOAD_PRESET = "wiki_fish";
  const CLOUDINARY_CLOUD_NAME = "dfmbhkfao";

  // Base64 placeholder image to avoid external dependencies and prevent infinite error loops
  const placeholderImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==";

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL;
    const BASE_URL = API_URL.includes("/api")
      ? API_URL.split("/api")[0]
      : API_URL.split("/espece")[0];

    const fetchData = async () => {
      try {
        // Fetch espece data
        const especeResponse = await axios.get(
          `${API_URL}/espece/readOne/${id_espece}`
        );
        const especeData = especeResponse.data.espece;
        setEspece(especeData);

        // Set image previews for existing images
        if (especeData.image_1) {
          if (especeData.image_1.startsWith("uploads/")) {
            setImagePreview1(`${BASE_URL}/${especeData.image_1}`);
            console.log(`Image 1 URL: ${BASE_URL}/${especeData.image_1}`);
          } else {
            setImagePreview1(especeData.image_1);
          }
        }

        if (especeData.image_2) {
          if (especeData.image_2.startsWith("uploads/")) {
            setImagePreview2(`${BASE_URL}/${especeData.image_2}`);
          } else {
            setImagePreview2(especeData.image_2);
          }
        }

        if (especeData.image_3) {
          if (especeData.image_3.startsWith("uploads/")) {
            setImagePreview3(`${BASE_URL}/${especeData.image_3}`);
          } else {
            setImagePreview3(especeData.image_3);
          }
        }

        // Fetch related data
        const [tempResponse, familleResponse, habitatResponse] =
          await Promise.all([
            axios.get(`${API_URL}/temperament/read`),
            axios.get(`${API_URL}/famille/read`),
            axios.get(`${API_URL}/habitat/read`),
          ]);

        setTemperaments(tempResponse.data.temperaments || []);
        setFamilles(familleResponse.data.familles || []);
        setHabitats(habitatResponse.data.habitats || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchData();
  }, [id_espece]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEspece((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Updated to store both the preview and the file
  const handleImageChange = (e, setPreview, setFile) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for Cloudinary upload
      if (setFile) setFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to upload a single image to Cloudinary
  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "fish_species");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      return {
        public_id: response.data.public_id,
        secure_url: response.data.secure_url,
      };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!actualUser || actualUser.role !== "admin") {
      toast.error("Vous ne disposez pas des droits pour cette modification");
      navigate("/home");
      return;
    }

    try {
      setUploading(true);
      toast.info("Mise à jour en cours...");

      // Upload new images to Cloudinary if selected
      let image1Url = espece.image_1;
      let image2Url = espece.image_2;
      let image3Url = espece.image_3;

      if (imageFile1) {
        const image1Result = await uploadToCloudinary(imageFile1);
        image1Url = image1Result.secure_url;
      }

      if (imageFile2) {
        const image2Result = await uploadToCloudinary(imageFile2);
        image2Url = image2Result.secure_url;
      }

      if (imageFile3) {
        const image3Result = await uploadToCloudinary(imageFile3);
        image3Url = image3Result.secure_url;
      }

      // Prepare data with Cloudinary URLs
      const API_URL = import.meta.env.VITE_API_URL;
      const especeData = {
        nom_commun: espece.nom_commun || "",
        nom_scientifique: espece.nom_scientifique || "",
        description: espece.description || "",
        taille_max: espece.taille_max || "",
        alimentation: espece.alimentation || "",
        temperature: espece.temperature || "",
        dificulte: espece.dificulte || "",
        id_temperament: espece.id_temperament || "",
        id_famille: espece.id_famille || "",
        id_habitat: espece.id_habitat || "",

        modifie_le: generateDateTime(),
        id_contribution_valide: espece.id_contribution_valide || "",
        // Use new Cloudinary URLs or keep existing ones
        image_1: image1Url,
        image_2: image2Url,
        image_3: image3Url,
      };

      // Debug logging
      console.log("Submitting update for espece ID:", id_espece);
      console.log("Update data:", especeData);

      // Send data to backend as JSON instead of FormData
      const response = await axios({
        method: "put",
        url: `${API_URL}/espece/update/${id_espece}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${actualUser.token}`,
        },
        data: especeData,
      });

      if (response.status === 200) {
        toast.success("Modification effectuée avec succès");
        setTimeout(() => {
          navigate("/backEspece");
        }, 1500);
      }
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error.response
        ? error.response.data.message || "Une erreur est survenue"
        : "Une erreur de connexion est survenue";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-table">
        <div className="center">
          <h2>Chargement des données...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="main-table">
      <div className="center">
        <h2>Modifier l'Espèce</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-sm-6 mx-auto">
          <div className="mt-4">
            <label className="form-label">Nom Commun</label>
            <input
              type="text"
              className="form-control"
              name="nom_commun"
              value={espece.nom_commun || ""}
              onChange={handleInputChange}
              required
              disabled={uploading}
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Nom Scientifique</label>
            <input
              type="text"
              className="form-control"
              name="nom_scientifique"
              value={espece.nom_scientifique || ""}
              onChange={handleInputChange}
              required
              disabled={uploading}
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={espece.description || ""}
              onChange={handleInputChange}
              required
              disabled={uploading}
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
              required
              disabled={uploading}
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
              required
              disabled={uploading}
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
              required
              disabled={uploading}
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Difficulté</label>
            <select
              className="form-control"
              name="dificulte"
              value={espece.dificulte || ""}
              onChange={handleInputChange}
              required
              disabled={uploading}
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
              required
              disabled={uploading}
            >
              <option value="">Sélectionnez un tempérament</option>
              {temperaments.map((temp) => (
                <option key={temp.id_temperament} value={temp.id_temperament}>
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
              required
              disabled={uploading}
            >
              <option value="">Sélectionnez une famille</option>
              {familles.map((fam) => (
                <option key={fam.id_famille} value={fam.id_famille}>
                  {fam.libelle}
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
              required
              disabled={uploading}
            >
              <option value="">Sélectionnez un habitat</option>
              {habitats.map((hab) => (
                <option key={hab.id_habitat} value={hab.id_habitat}>
                  {hab.libelle}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label className="form-label">Image 1</label>
            <input
              type="file"
              className="form-control"
              name="image_1"
              onChange={(e) =>
                handleImageChange(e, setImagePreview1, setImageFile1)
              }
              accept="image/*"
              disabled={uploading}
            />
            {imagePreview1 && (
              <div className="mt-2">
                <p>Image actuelle ou nouvelle:</p>
                <img
                  src={imagePreview1}
                  alt="Preview 1"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                  onError={(e) => {
                    if (e.target.src !== placeholderImage) {
                      console.log("Image 1 load error, using placeholder");
                      e.target.src = placeholderImage;
                      e.target.onerror = null; // Prevent infinite loop
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="form-label">Image 2 (optionnel)</label>
            <input
              type="file"
              className="form-control"
              name="image_2"
              onChange={(e) =>
                handleImageChange(e, setImagePreview2, setImageFile2)
              }
              accept="image/*"
              disabled={uploading}
            />
            {imagePreview2 && (
              <div className="mt-2">
                <p>Image actuelle ou nouvelle:</p>
                <img
                  src={imagePreview2}
                  alt="Preview 2"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                  onError={(e) => {
                    if (e.target.src !== placeholderImage) {
                      console.log("Image 2 load error, using placeholder");
                      e.target.src = placeholderImage;
                      e.target.onerror = null; // Prevent infinite loop
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="form-label">Image 3 (optionnel)</label>
            <input
              type="file"
              className="form-control"
              name="image_3"
              onChange={(e) =>
                handleImageChange(e, setImagePreview3, setImageFile3)
              }
              accept="image/*"
              disabled={uploading}
            />
            {imagePreview3 && (
              <div className="mt-2">
                <p>Image actuelle ou nouvelle:</p>
                <img
                  src={imagePreview3}
                  alt="Preview 3"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                  onError={(e) => {
                    if (e.target.src !== placeholderImage) {
                      console.log("Image 3 load error, using placeholder");
                      e.target.src = placeholderImage;
                      e.target.onerror = null; // Prevent infinite loop
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="center mt-4 mb-4">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Chargement...
              </>
            ) : (
              "Modifier"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackEspeceUpdate;
