import axiosClient from '../axiosClient';

interface Driver {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  agencyId: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const driverService = {
  // GET all drivers
  getAll: async (): Promise<ApiResponse<Driver[]>> => {
    return await axiosClient.get('/drivers');
  },

  // GET one driver by ID
  getById: async (id: string): Promise<ApiResponse<Driver>> => {
    return await axiosClient.get(`/drivers/${id}`);
  },

  // POST create new driver
  create: async (data: Partial<Driver>): Promise<ApiResponse<Driver>> => {
    return await axiosClient.post('/drivers', data);
  },

  // PUT update driver
  update: async (id: string, data: Partial<Driver>): Promise<ApiResponse<Driver>> => {
    return await axiosClient.put(`/drivers/${id}`, data);
  },

  // DELETE driver
  delete: async (id: string): Promise<ApiResponse<Driver>> => {
    return await axiosClient.delete(`/drivers/${id}`);
  }
};

export default driverService;
