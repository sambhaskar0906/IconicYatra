import axios from "axios";

// 🔹 Change this to your live URL when deploying
export const BASE_URL = "https://api.iconicyatra.com"; // ✅ export added

// User APIs
export const axiosInstance = axios.create({
    baseURL: `${BASE_URL}/api/v1/user`,
    headers: { "Content-Type": "application/json" },
});

// Payment APIs
export const paymentAxios = axios.create({
    baseURL: `${BASE_URL}/api/payment`,
    headers: { "Content-Type": "application/json" },
});

// Inquiry APIs
export const inquiryAxios = axios.create({
    baseURL: `${BASE_URL}/api/v1`,
    headers: { "Content-Type": "application/json" },
});

export const packagesAxios = axios.create({
    baseURL: `${BASE_URL}/api/v1/packages`,
    headers: { "Content-Type": "application/json" },
});

// Token interceptor
const attachToken = (config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

axiosInstance.interceptors.request.use(attachToken);
paymentAxios.interceptors.request.use(attachToken);
inquiryAxios.interceptors.request.use(attachToken);
packagesAxios.interceptors.request.use(attachToken);
