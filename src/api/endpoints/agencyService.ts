import axiosClient from '../axiosClient';

interface Agency {
  id: string;
  code: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  status: string;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const agencyService = {
  // GET all agencies
  getAll: async (): Promise<ApiResponse<Agency[]>> => {
    return await axiosClient.get('/agencies');
  },

  // GET one agency by ID
  getById: async (id: string): Promise<ApiResponse<Agency>> => {
    return await axiosClient.get(`/agencies/${id}`);
  },

  // POST create new agency
  create: async (data: Partial<Agency>): Promise<ApiResponse<Agency>> => {
    return await axiosClient.post('/agencies', data);
  },

  // PUT update agency
  update: async (id: string, data: Partial<Agency>): Promise<ApiResponse<Agency>> => {
    return await axiosClient.put(`/agencies/${id}`, data);
  },

  // DELETE agency
  delete: async (id: string): Promise<ApiResponse<Agency>> => {
    return await axiosClient.delete(`/agencies/${id}`);
  }
};

// Default export for compatibility
export default agencyService;
