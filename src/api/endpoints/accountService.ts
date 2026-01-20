import axiosClient from '../axiosClient';

interface Account {
  id: string;
  code: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  password?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const accountService = {
  // GET all accounts
  getAll: async (): Promise<ApiResponse<Account[]>> => {
    return await axiosClient.get('/accounts');
  },

  // GET one account by ID
  getById: async (id: string): Promise<ApiResponse<Account>> => {
    return await axiosClient.get(`/accounts/${id}`);
  },

  // POST create new account
  create: async (data: Partial<Account>): Promise<ApiResponse<Account>> => {
    return await axiosClient.post('/accounts', data);
  },

  // PUT update account
  update: async (id: string, data: Partial<Account>): Promise<ApiResponse<Account>> => {
    return await axiosClient.put(`/accounts/${id}`, data);
  },

  // DELETE account
  delete: async (id: string): Promise<ApiResponse<Account>> => {
    return await axiosClient.delete(`/accounts/${id}`);
  }
};
