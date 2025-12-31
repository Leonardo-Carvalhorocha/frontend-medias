import axios from 'axios';

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
    return response
  },
  (error) => {      
    if(error && error.status === 401) {
      window.dispatchEvent(new Event('logout-modal'));
    }

    return Promise.reject(error);
  }
);

export default api;
