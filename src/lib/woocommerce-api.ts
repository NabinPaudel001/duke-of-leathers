// lib/woocommerce-api.ts
import axios from "axios";

// Create axios instance with proper defaults
const woocommerceAPI = axios.create({
  baseURL: 'https://wp.dukeofleathers.no/', // Your WordPress base URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to include cookies and headers
woocommerceAPI.interceptors.request.use(
  (config) => {
    console.log('Request to:', config.url, 'with headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle cookies and headers
woocommerceAPI.interceptors.response.use(
  (response) => {
    console.log('Response from:', response.config.url, 'with headers:', response.headers);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default woocommerceAPI;