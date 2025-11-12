import axios from 'axios';

// Crea un'istanza axios configurata per Nova RE API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082',
  // NON impostare Content-Type globale - lascia che axios lo determini in base al tipo di data
  timeout: 10000, // 10 secondi di timeout
});

// Interceptor per le richieste
apiClient.interceptors.request.use(
  (config) => {
    // Imposta Content-Type solo se non è FormData
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
      console.log('📋 Headers:', config.headers);
      console.log('📦 Data Type:', config.data instanceof FormData ? 'FormData' : typeof config.data);
      if (config.headers?.Authorization) {
        console.log('🔐 Auth Header:', config.headers.Authorization.substring(0, 20) + '...');
      }
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
    if (error.response?.data) {
      console.error('📄 Response Data:', error.response.data);
    }
    console.error('📋 Request Headers:', error.config?.headers);
    return Promise.reject(error);
  }
);

export default apiClient;