import axiosClient from '../axiosClient';

interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
}

interface InventoryProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  unitPrice: number;
  stock: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryOverview {
  summary: InventorySummary;
  products: InventoryProduct[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const inventoryService = {
  // GET inventory overview
  getOverview: async (): Promise<ApiResponse<InventoryOverview>> => {
    return await axiosClient.get('/inventory/overview');
  },
  
  // GET all inventory items
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await axiosClient.get('/inventory');
    return response.data;
  }
};

// Default export for compatibility
export default inventoryService;
