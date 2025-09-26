import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://api.iconicyatra.com/api/v1/user",
    headers: {
        "Content-Type": "application/json"
    }
});

// Add token automatically if exists
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
