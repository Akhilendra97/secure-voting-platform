import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // 🔥 FIX: avoid null / undefined token
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 GLOBAL ERROR HANDLER (AUTO LOGOUT FIX)
API.interceptors.response.use(
  (response) => response,
  (error) => {

    // 🔥 token invalid → logout
   if (error.response?.status === 401) {
  localStorage.removeItem("token");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

    return Promise.reject(error);
  }
);

export default API;