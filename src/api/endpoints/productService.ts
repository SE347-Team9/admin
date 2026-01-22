import axiosClient from '../axiosClient';

interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stock: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const productService = {
  // GET all products
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    return await axiosClient.get('/products');
  },

  // GET one product by ID
  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return await axiosClient.get(`/products/${id}`);
  },

  // POST create new product
  create: async (data: Partial<Product>): Promise<ApiResponse<Product>> => {
    return await axiosClient.post('/products', data);
  },

  // PUT update product
  update: async (id: string, data: Partial<Product>): Promise<ApiResponse<Product>> => {
    return await axiosClient.put(`/products/${id}`, data);
  },

  // DELETE product
  delete: async (id: string): Promise<ApiResponse<Product>> => {
    return await axiosClient.delete(`/products/${id}`);
  }
};

export default productService;
