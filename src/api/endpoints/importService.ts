import axiosClient from '../axiosClient';

export interface ImportProduct {
  product_id: string;
  product_name?: string;
  product_code?: string;
  batch: string;
  mfg_date: string;
  exp_date: string;
  quantity: number;
  unit?: string;
  price: number;
  subtotal?: number;
}

export interface Import {
  id: number;
  code: string;
  distribution_id?: number;
  distribution_code?: string;
  agency_id: string;
  agency_name?: string;
  agency_code?: string;
  ship_date?: string;
  receive_date?: string;
  status: 'pending' | 'received' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_by?: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  products?: ImportProduct[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const importService = {
  // Get all imports
  getAll: async (): Promise<ApiResponse<Import[]>> => {
    const response = await axiosClient.get('/imports');
    return response.data;
  },

  // Get import by ID
  getById: async (id: number): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.get(`/imports/${id}`);
    return response.data;
  },

  // Create new import
  create: async (importData: {
    distribution_id?: number;
    agency_id: string;
    ship_date?: string;
    receive_date?: string;
    notes?: string;
    products: { product_id: string; batch: string; mfg_date: string; exp_date: string; quantity: number; price: number }[];
  }): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.post('/imports', importData);
    return response.data;
  },

  // Confirm/receive import
  receive: async (id: number): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.put(`/imports/${id}/receive`);
    return response.data;
  },

  // Cancel import
  cancel: async (id: number, reason?: string): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.put(`/imports/${id}/cancel`, { reason });
    return response.data;
  }
};

export default importService;
