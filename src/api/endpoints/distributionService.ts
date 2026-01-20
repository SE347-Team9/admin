import axiosClient from '../axiosClient';

export interface DistributionProduct {
  product_id: string;
  product_name?: string;
  product_code?: string;
  quantity: number;
  unit?: string;
  price: number;
  subtotal?: number;
}

export interface Distribution {
  id: number;
  code: string;
  agency_id: string;
  agency_name?: string;
  agency_code?: string;
  request_date: string;
  delivery_date?: string;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  total: number;
  notes?: string;
  created_by?: string;
  created_by_name?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  products?: DistributionProduct[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const distributionService = {
  // Get all distributions
  getAll: async (): Promise<ApiResponse<Distribution[]>> => {
    const response = await axiosClient.get('/distributions');
    return response.data;
  },

  // Get distribution by ID
  getById: async (id: number): Promise<ApiResponse<Distribution>> => {
    const response = await axiosClient.get(`/distributions/${id}`);
    return response.data;
  },

  // Create new distribution request
  create: async (distributionData: {
    agency_id: string;
    request_date: string;
    delivery_date?: string;
    notes?: string;
    products: { product_id: string; quantity: number; price: number }[];
  }): Promise<ApiResponse<Distribution>> => {
    const response = await axiosClient.post('/distributions', distributionData);
    return response.data;
  },

  // Approve distribution (staff/admin only)
  approve: async (id: number): Promise<ApiResponse<Distribution>> => {
    const response = await axiosClient.put(`/distributions/${id}/approve`);
    return response.data;
  },

  // Deliver distribution (mark as delivered)
  deliver: async (id: number): Promise<ApiResponse<Distribution>> => {
    const response = await axiosClient.put(`/distributions/${id}/deliver`);
    return response.data;
  },

  // Cancel distribution
  cancel: async (id: number, reason?: string): Promise<ApiResponse<Distribution>> => {
    const response = await axiosClient.put(`/distributions/${id}/cancel`, { reason });
    return response.data;
  }
};

export default distributionService;
