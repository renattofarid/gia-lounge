import axios from "axios";
import { errorToast } from "./core.function";

const prodURL = "https://develop.garzasoft.com/Gia-Backend/public/api";
export const prodAssetURL = "https://develop.garzasoft.com/Gia-Backend/public";
const baseURL = prodURL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Interceptor para incluir el token en cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("No autorizado: Redirigiendo al login...");
      // Elimina el token y redirige al login
      localStorage.removeItem("token");
      errorToast("No autorizado: Redirigiendo al login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
