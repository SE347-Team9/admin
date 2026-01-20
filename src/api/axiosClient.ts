import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create axios instance
const axiosClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Tự động gắn token vào mỗi request
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý response và lỗi
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về data từ response.data (backend format: {success, data, message})
    return response.data;
  },
  (error) => {
    // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Xử lý lỗi khác
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

export default axiosClient;
