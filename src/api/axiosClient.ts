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
    console.log('Axios interceptor received:', response.data);
    return response.data;
  },
  (error) => {
    // Xử lý lỗi 401 - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Xử lý lỗi khác - trả về error response data nếu có
    const errorData = error.response?.data || {
      success: false,
      message: error.message || 'Unknown error'
    };
    
    console.error('API Error:', errorData);
    
    // Throw error object với data đầu đủ để frontend có thể access response.data.message
    const errorWithResponse = new Error(errorData.message || 'Unknown error');
    (errorWithResponse as any).response = {
      data: errorData
    };
    
    return Promise.reject(errorWithResponse);
  }
);

export default axiosClient;
