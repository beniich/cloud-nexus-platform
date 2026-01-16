import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

// Create Axios instance
export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock CSRF Token getter (would ideally come from a cookie or meta tag)
const getCsrfToken = () => {
    return localStorage.getItem('csrf-token') || 'mock-csrf-token';
};

// CSRF Interceptor
axiosInstance.interceptors.request.use((config) => {
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
        config.headers['X-CSRF-Token'] = getCsrfToken();
    }

    // Legacy: Add token from localStorage if exists (to be removed in next step)
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor for generic error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || error.message || 'Request failed';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

// Adapter to maintain existing apiClient interface
export const apiClient = {
    get: <T>(endpoint: string, options?: any) => axiosInstance.get<T>(endpoint, options),
    post: <T>(endpoint: string, body: any, options?: any) => axiosInstance.post<T>(endpoint, body, options),
    put: <T>(endpoint: string, body: any, options?: any) => axiosInstance.put<T>(endpoint, body, options),
    delete: <T>(endpoint: string, options?: any) => axiosInstance.delete<T>(endpoint, options),
};
