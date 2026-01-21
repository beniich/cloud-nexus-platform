import axios from 'axios';

// Create Axios instance
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000', // Backend URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for cookies
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally if needed
        if (error.response?.status === 401) {
            console.warn('Unauthorized access, redirecting to login...');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);
