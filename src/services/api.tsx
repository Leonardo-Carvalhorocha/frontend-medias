import axios from 'axios';
import { getToken } from './api.auth.service';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const token = getToken(); 
    if(error && error.status === 401 && token) {
      window.dispatchEvent(new Event('logout-modal'));
    }

    return Promise.reject(error);
  }
);

export default api;
