import axios from 'axios';

// Crea un'istanza axios configurata per Nova RE API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondi di timeout
});

// Interceptor per le richieste (opzionale, per logging in sviluppo)
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor per le risposte (opzionale, per logging in sviluppo)
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.config?.url);
    return Promise.reject(error);
  }
);

export default apiClient;