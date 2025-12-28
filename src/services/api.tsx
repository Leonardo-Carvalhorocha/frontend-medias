import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("response: ", response);
    return response
  },
  (error) => {
    const navigate = useNavigate();
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }

    return Promise.reject(error);
  }
);

export default api;
