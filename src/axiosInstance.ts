import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://ee0d-46-109-142-185.ngrok-free.app';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;