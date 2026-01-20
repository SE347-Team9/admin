import axiosClient from '../axiosClient';

interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  rating: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const supplierService = {
  // GET all suppliers
  getAll: async (): Promise<ApiResponse<Supplier[]>> => {
    return await axiosClient.get('/suppliers');
  },

  // GET one supplier by ID
  getById: async (id: string): Promise<ApiResponse<Supplier>> => {
    return await axiosClient.get(`/suppliers/${id}`);
  },

  // POST create new supplier
  create: async (data: Partial<Supplier>): Promise<ApiResponse<Supplier>> => {
    return await axiosClient.post('/suppliers', data);
  },

  // PUT update supplier
  update: async (id: string, data: Partial<Supplier>): Promise<ApiResponse<Supplier>> => {
    return await axiosClient.put(`/suppliers/${id}`, data);
  },

  // DELETE supplier
  delete: async (id: string): Promise<ApiResponse<Supplier>> => {
    return await axiosClient.delete(`/suppliers/${id}`);
  },

  // GET products by supplier
  getProducts: async (id: string): Promise<ApiResponse<any[]>> => {
    return await axiosClient.get(`/suppliers/${id}/products`);
  }
};
