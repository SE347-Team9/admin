import axiosClient from '../axiosClient';

export interface ImportProduct {
  product_id: number;
  product_name?: string;
  product_code?: string;
  batch?: string;
  mfg_date?: string;
  exp_date?: string;
  quantity: number;
  unit?: string;
  price: number;
  subtotal?: number;
}

export interface Import {
  id?: number;
  import_id?: number;
  code?: string;
  import_code?: string;
  supplier_id?: number;
  import_date?: string;
  status: 'pending' | 'completed' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
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
    return response as ApiResponse<Import[]>;
  },

  // Get import by ID
  getById: async (id: number): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.get(`/imports/${id}`);
    return response as ApiResponse<Import>;
  },

  // Create new import
  create: async (importData: {
    supplierId?: number;
    shipDate?: string;
    products: { 
      productId: string; 
      batch?: string; 
      mfgDate?: string; 
      expDate?: string; 
      quantity: number; 
      price: number 
    }[];
    notes?: string;
  }): Promise<ApiResponse<Import>> => {
    // axios interceptor already returns response.data, so we don't call .data again
    const response = await axiosClient.post('/imports', importData);
    // response here is already {success, message, data} - NOT wrapped again
    return response as ApiResponse<Import>;
  },

  // Confirm import
  confirm: async (id: number): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.put(`/imports/${id}/confirm`);
    return response as ApiResponse<Import>;
  },

  // Get pending imports for admin approval
  getPending: async (): Promise<ApiResponse<Import[]>> => {
    const response = await axiosClient.get('/imports/pending/list');
    return response as ApiResponse<Import[]>;
  },

  // Approve import (admin)
  approve: async (id: number, approved: boolean): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.put(`/imports/${id}/approve`, { approved });
    return response as ApiResponse<Import>;
  },

  // Cancel import
  cancel: async (id: number): Promise<ApiResponse<Import>> => {
    const response = await axiosClient.put(`/imports/${id}/cancel`);
    return response as ApiResponse<Import>;
  }
};

export default importService;

