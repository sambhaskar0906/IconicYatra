import axios from "axios";

// User APIs
export const axiosInstance = axios.create({
    baseURL: "https://api.iconicyatra.com/api/v1/user",
    headers: { "Content-Type": "application/json" },
});

// Payment APIs
export const paymentAxios = axios.create({
    baseURL: "https://api.iconicyatra.com/api/payment",
    headers: { "Content-Type": "application/json" },
});

// Inquiry APIs
export const inquiryAxios = axios.create({
    baseURL: "https://api.iconicyatra.com/api/v1",
    headers: { "Content-Type": "application/json" },
});

// Add token automatically for user requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add token automatically for payment requests
paymentAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

inquiryAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

