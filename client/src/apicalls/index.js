import axios from "axios";

// Create an Axios instance with a default authorization header
const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Update the Authorization header if the token changes
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const baseUrl = 'https://chat-app-backend-neop.onrender.com';

export default axiosInstance;
