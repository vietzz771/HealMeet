import axios from 'axios';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const instance = axios.create({
  baseURL: `${SERVER_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const get = async (path, options = {}) => {
  const response = await instance.get(path, options);
  return response.data;
};

export default instance;
