import axiosClient from '../axiosClient';

export interface Regulation {
  id: string;
  code: string;
  name: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const regulationService = {
  getAll: (): Promise<ApiResponse<Regulation[]>> => {
    return axiosClient.get('/regulations');
  },

  getById: (id: string): Promise<ApiResponse<Regulation>> => {
    return axiosClient.get(`/regulations/${id}`);
  },

  update: (id: string, data: Partial<Regulation>): Promise<ApiResponse<Regulation>> => {
    return axiosClient.put(`/regulations/${id}`, data);
  }
};

// Default export for compatibility
export default regulationService;
