import axios from "axios";

// This function handles the upload to Cloudinary
export const uploadToCloudinary = async (file) => {
  if (!file) return null;

  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "wiki_fish"); // Create this preset in your Cloudinary dashboard
  formData.append("folder", "fish_species");

  try {
    // Direct upload to Cloudinary (no need for backend intervention)
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dfmbhkfao/image/upload`,
      formData
    );

    // Return the secure URL of the uploaded image
    return {
      public_id: response.data.public_id,
      secure_url: response.data.secure_url,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
};
