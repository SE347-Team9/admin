import axiosClient from '../axiosClient';

export interface Payment {
  id: string;
  code: string;
  agency_id: string;
  agency_name?: string;
  agency_code?: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  description?: string;
  created_by?: string;
  created_by_name?: string;
  confirmed_by?: string;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DebtInfo {
  agency_id: string;
  agency_name: string;
  agency_code: string;
  current_debt: number;
  credit_limit: number;
  available_credit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const paymentService = {
  // Get all payments
  getAll: async (): Promise<ApiResponse<Payment[]>> => {
    const response = await axiosClient.get('/payments');
    return response.data;
  },

  // Get payment by ID
  getById: async (id: string): Promise<ApiResponse<Payment>> => {
    const response = await axiosClient.get(`/payments/${id}`);
    return response.data;
  },

  // Get debt info for an agency
  getDebtInfo: async (agencyId?: string): Promise<ApiResponse<DebtInfo>> => {
    const url = agencyId ? `/payments/debt-info/${agencyId}` : '/payments/debt-info';
    const response = await axiosClient.get(url);
    return response.data;
  },

  // Create new payment
  create: async (paymentData: {
    agency_id: string;
    amount: number;
    payment_method: string;
    description?: string;
  }): Promise<ApiResponse<Payment>> => {
    const response = await axiosClient.post('/payments', paymentData);
    return response.data;
  },

  // Confirm payment (staff/admin only)
  confirm: async (id: string): Promise<ApiResponse<Payment>> => {
    const response = await axiosClient.put(`/payments/${id}/confirm`);
    return response.data;
  },

  // Cancel payment
  cancel: async (id: string, reason?: string): Promise<ApiResponse<Payment>> => {
    const response = await axiosClient.put(`/payments/${id}/cancel`, { reason });
    return response.data;
  }
};

export default paymentService;
