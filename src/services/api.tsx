import axios from "axios";
import { getToken } from "./api.auth.service";
import { dispatchGlobalError } from "../events/global-error";

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
  (response) => response,
  (error) => {
    const token = getToken();

    if (error?.response) {
      const status = error.response.status;
      const message =
        error.response.data?.erro ||
        "Ocorreu um erro inesperado.";

      // erro global (exceto 401)
      if (status !== 401) {
        dispatchGlobalError(message);
      }

      // logout
      if (status === 401 && token) {
        window.dispatchEvent(new Event("logout-modal"));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
