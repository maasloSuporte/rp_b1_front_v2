import axios from 'axios';
import { environment } from '../infrastructure/environment';

const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('Authorization') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login se não autenticado
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
