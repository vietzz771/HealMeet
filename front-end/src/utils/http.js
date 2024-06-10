import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const get = async (path, options = {}) => {
  const response = await instance.get(path, options);
  return response.data;
};

export default instance;
