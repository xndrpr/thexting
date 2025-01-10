import axios from "axios";
import { ApiService } from "../services/ApiService";

axios.defaults.withCredentials = true;
export const $api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

$api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await ApiService.refreshToken();
        return $api(originalRequest);
      } catch (error) {}
    }
  }
);
