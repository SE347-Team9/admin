import axiosClient from '../axiosClient';

interface AgencyDashboardStats {
  currentDebt: number;
  creditLimit: number;
  monthlyImports: number;
  monthlyPayments: number;
  debtTrend: Array<{ month: string; debt: number }>;
  paymentTrend: Array<{ month: string; total: number }>;
}

interface StaffDashboardStats {
  totalAgencies: number;
  monthlyExports: number;
  totalDebt: number;
  monthlyPayments: number;
  distributionTrend: Array<{ month: string; distribution_value: number; import_value: number }>;
}

interface AdminDashboardStats {
  totalAgencies: number;
  totalProducts: number;
  totalInventoryValue: number;
  monthlyDistributions: number;
  monthlyStats: Array<{ month: string; distribution_value: number; import_value: number; payment_value: number }>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const dashboardService = {
  // Get dashboard statistics (role-specific)
  getStats: async (): Promise<ApiResponse<AgencyDashboardStats | StaffDashboardStats | AdminDashboardStats>> => {
    const response = await axiosClient.get('/dashboard/stats');
    return response.data;
  }
};

export default dashboardService;
export type { AgencyDashboardStats, StaffDashboardStats, AdminDashboardStats };
