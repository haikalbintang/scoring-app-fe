// lib/api.ts

import axios from "axios";
import { BASE_URL } from "@/constants";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // IMPORTANT for httpOnly cookies
});

api.interceptors.request.use(
  (config) => {
    // You can add authorization headers or other custom headers here
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isLoginRequest = requestUrl.includes("/auth/token");

    if (status === 408 && !isLoginRequest) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
