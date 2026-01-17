import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../config";
import { store } from "@store/index";

const customAxios: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor
customAxios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const state = store.getState();
        const token = state.authReducer.JWTToken;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
customAxios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // Handle 401
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Logic for refresh token could go here
        }
        return Promise.reject(error);
    }
);

export default customAxios;
