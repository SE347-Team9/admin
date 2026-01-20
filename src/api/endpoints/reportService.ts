import axiosClient from '../axiosClient';

export interface Report {
  id: number;
  code: string;
  type: 'import' | 'distribution' | 'debt' | 'payment';
  period?: string;
  value?: number;
  created_by?: string;
  created_by_name?: string;
  data?: any;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const reportService = {
  // Get all reports
  getAll: async (): Promise<ApiResponse<Report[]>> => {
    const response = await axiosClient.get('/reports');
    return response.data;
  },

  // Get report by ID
  getById: async (id: number): Promise<ApiResponse<Report>> => {
    const response = await axiosClient.get(`/reports/${id}`);
    return response.data;
  },

  // Generate report
  generate: async (type: string, startDate: string, endDate: string): Promise<ApiResponse<Report>> => {
    const response = await axiosClient.post('/reports', {
      type,
      start_date: startDate,
      end_date: endDate
    });
    return response.data;
  },

  // Create new report
  create: async (data: {
    title: string;
    type: string;
    month: number;
    year: number;
    data: any;
  }): Promise<ApiResponse<Report>> => {
    const response = await axiosClient.post('/reports', data);
    return response.data;
  },

  // Delete report
  delete: async (id: number): Promise<ApiResponse<any>> => {
    const response = await axiosClient.delete(`/reports/${id}`);
    return response.data;
  }
};

export default reportService;
