const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
const cloudName = import.meta.env.VITE_CLOUD_NAME;
import axios from 'axios';

const uploadImageToCloudinary = async (file) => {
  const uploadData = new FormData();
  uploadData.append('file', file);
  uploadData.append('upload_preset', uploadPreset);
  uploadData.append('cloud_name', cloudName);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    uploadData,
  );
  const data = await res.data;
  return data;
};

export default uploadImageToCloudinary;
