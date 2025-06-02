import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { logger } from "../../../services/logger.service.js";

const EditContribution = () => {
  const { id_contribution } = useParams();
  let actualUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [contribution, setContribution] = useState({});
  const [temperaments, setTemperaments] = useState([]);
  const [familles, setfamilles] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [imagePreview3, setImagePreview3] = useState(null);

  useEffect(() => {
    logger.info(
      "EditContribution component mounted - User editing contribution",
      {
        contribution_id: id_contribution,
        user_id: actualUser?.userId,
        user_role: actualUser?.role,
      }
    );

    const API_URL = import.meta.env.VITE_API_URL;

    // Fetch contribution data
    axios
      .get(`${API_URL}/contribution/readOne/${id_contribution}`)
      .then((response) => {
        const contributionData = response.data.contribution;
        setContribution(contributionData);

        logger.info("Contribution data loaded for editing", {
          contribution_id: id_contribution,
          species_name: contributionData?.nom_commun,
          contribution_owner: contributionData?.user_id,
          validation_status: contributionData?.validation,
          user_id: actualUser?.userId,
        });

        // Verification des droits après chargement des données
        if (actualUser && contributionData) {
          const canEdit =
            (actualUser.role === "user" &&
              actualUser.userId === contributionData.user_id &&
              contributionData.validation === 0) ||
            (actualUser.role === "admin" &&
              actualUser.userId === contributionData.user_id &&
              contributionData.validation === 0);

          if (!canEdit) {
            logger.warn("Unauthorized attempt to edit contribution", {
              contribution_id: id_contribution,
              contribution_owner: contributionData.user_id,
              attempted_by: actualUser.userId,
              user_role: actualUser.role,
              validation_status: contributionData.validation,
            });
          }
        }
      })
      .catch((error) => {
        logger.error("Failed to load contribution data for editing", {
          contribution_id: id_contribution,
          error: error.message,
          status: error.response?.status,
          user_id: actualUser?.userId,
        });
        console.error("Error fetching contribution:", error);
      });

    // Fetch temperaments
    axios
      .get(`${API_URL}/temperament/read`)
      .then((response) => setTemperaments(response.data.temperaments))
      .catch((error) => {
        logger.error("Failed to load temperaments for contribution edit", {
          error: error.message,
          user_id: actualUser?.userId,
        });
        console.error("Error fetching temperaments:", error);
      });

    // Fetch familles
    axios
      .get(`${API_URL}/famille/read`)
      .then((response) => setfamilles(response.data.familles))
      .catch((error) => {
        logger.error("Failed to load families for contribution edit", {
          error: error.message,
          user_id: actualUser?.userId,
        });
        console.error("Error fetching familles:", error);
      });

    // Fetch habitats
    axios
      .get(`${API_URL}/habitat/read`)
      .then((response) => setHabitats(response.data.habitats))
      .catch((error) => {
        logger.error("Failed to load habitats for contribution edit", {
          error: error.message,
          user_id: actualUser?.userId,
        });
        console.error("Error fetching habitats:", error);
      });
  }, [id_contribution]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContribution((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e, setPreview, imageKey) => {
    const file = e.target.files[0];
    if (file) {
      logger.debug("User changing image in contribution edit", {
        contribution_id: id_contribution,
        image_key: imageKey,
        file_name: file.name,
        file_size: file.size,
        user_id: actualUser?.userId,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (actualUser !== undefined && actualUser.role === "user") ||
      (actualUser !== undefined &&
        actualUser.role === "admin" &&
        actualUser.userId === contribution.user_id &&
        contribution.validation === 0)
    ) {
      logger.info("User submitting contribution update", {
        contribution_id: id_contribution,
        species_name: contribution.nom_commun,
        user_id: actualUser.userId,
        user_role: actualUser.role,
        has_new_image1: !!e.target.image_1.files[0],
        has_new_image2: !!e.target.image_2.files[0],
        has_new_image3: !!e.target.image_3.files[0],
      });

      const API_URL = import.meta.env.VITE_API_URL;
      const formData = new FormData();

      // Append all text data (sans date_creation)
      formData.append("nom_commun", contribution.nom_commun);
      formData.append("nom_scientifique", contribution.nom_scientifique);
      formData.append("description", contribution.description);
      formData.append("taille_max", contribution.taille_max);
      formData.append("alimentation", contribution.alimentation);
      formData.append("temperature", contribution.temperature);
      formData.append("dificulte", contribution.dificulte);
      formData.append("id_temperament", contribution.id_temperament);
      formData.append("id_famille", contribution.id_famille);
      formData.append("id_habitat", contribution.id_habitat);
      formData.append("cree_le", contribution.cree_le);
      formData.append("id_espece", contribution.id_espece);
      formData.append("user_id", actualUser.userId);
      formData.append("validation", contribution.validation);
      formData.append("id_contribution", id_contribution);

      // ✅ Append images only if they exist (nouvelles images)
      if (e.target.image_1.files[0]) {
        formData.append("image_1", e.target.image_1.files[0]);
      }
      if (e.target.image_2.files[0]) {
        formData.append("image_2", e.target.image_2.files[0]);
      }
      if (e.target.image_3.files[0]) {
        formData.append("image_3", e.target.image_3.files[0]);
      }

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: `${API_URL}/contribution/update/${id_contribution}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${actualUser.token}`,
        },
        data: formData,
      };

      try {
        const response = await axios.request(config);
        if (response.status === 200) {
          logger.info("Contribution updated successfully by user", {
            contribution_id: id_contribution,
            species_name: contribution.nom_commun,
            user_id: actualUser.userId,
            user_role: actualUser.role,
            awaiting_validation: true,
          });

          toast.success("Modification effectuée avec succès");
          setTimeout(() => {
            navigate("/userProfile");
          }, 3000);
        }
      } catch (error) {
        const errorMessage = error.response
          ? error.response.data.message || "An error occurred"
          : "An error occurred";

        logger.error("Failed to update contribution", {
          contribution_id: id_contribution,
          species_name: contribution.nom_commun,
          error: errorMessage,
          status: error.response?.status,
          user_id: actualUser.userId,
        });

        toast.error(errorMessage);
      }
    } else {
      logger.warn("Unauthorized attempt to update contribution", {
        contribution_id: id_contribution,
        user_role: actualUser?.role,
        user_id: actualUser?.userId,
        contribution_owner: contribution.user_id,
        validation_status: contribution.validation,
        reason:
          contribution.validation === 1
            ? "already_validated"
            : "unauthorized_user",
      });

      toast.error(
        "Vous ne disposez pas des droits pour cette modification ou elle a déjà été validée. Dans ce cas vous devez en créer une nouvelle"
      );
      navigate("/");
    }
  };

  return (
    <div className="main-table">
      <div className="center">
        <h2>Modifier la contribution à l'Espèce</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="col-sm-6 mx-auto">
          <div className="mt-4">
            <label className="form-label">Nom Commun</label>
            <input
              type="text"
              className="form-control"
              name="nom_commun"
              value={contribution.nom_commun || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Nom Scientifique</label>
            <input
              type="text"
              className="form-control"
              name="nom_scientifique"
              value={contribution.nom_scientifique || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              value={contribution.description || ""}
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
              value={contribution.taille_max || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Alimentation</label>
            <input
              type="text"
              className="form-control"
              name="alimentation"
              value={contribution.alimentation || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Température (°C)</label>
            <input
              type="number"
              className="form-control"
              name="temperature"
              value={contribution.temperature || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4">
            <label className="form-label">Difficulté</label>
            <select
              className="form-control"
              name="dificulte"
              value={contribution.dificulte || ""}
              onChange={handleInputChange}
              required
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
              value={contribution.id_temperament || ""}
              onChange={handleInputChange}
              required
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
            <label className="form-label">Catégorie</label>
            <select
              className="form-control"
              name="id_famille"
              value={contribution.id_famille || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
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
              value={contribution.id_habitat || ""}
              onChange={handleInputChange}
              required
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
                handleImageChange(e, setImagePreview1, "image_1")
              }
              accept="image/*"
            />
            {imagePreview1 && (
              <img
                src={imagePreview1}
                alt="Preview 1"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="mt-4">
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
              <img
                src={imagePreview2}
                alt="Preview 2"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="mt-4">
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
              <img
                src={imagePreview3}
                alt="Preview 3"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </div>
        </div>
        <div className="center mt-4">
          <button className="btn btn-primary" type="submit">
            Modifier contribution
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditContribution;
