import axios from "axios";


const prodURL = "https://develop.garzasoft.com/Gia-Backend/public/api"
const baseURL = prodURL;

export const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

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