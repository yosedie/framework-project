import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = localStorage.getItem('token');
      config.headers = config.headers || {};
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;