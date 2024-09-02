import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://a0b4-46-109-142-185.ngrok-free.app';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  (config) => {
    console.log(`Sending request to: ${config.url}`);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log(`Received response from: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error.response || error);
    return Promise.reject(error);
  }
);

export default instance;