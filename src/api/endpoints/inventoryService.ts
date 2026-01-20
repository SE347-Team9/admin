import axiosClient from '../axiosClient';

interface InventorySummary {
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  nearExpiry: number;
  expired: number;
}

interface InventoryProduct {
  product_id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  min_stock: number;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_code: string;
  batch_code: string | null;
  expiry_date: string | null;
  batch_status: string | null;
  expiry_status: string | null;
  days_until_expiry: number | null;
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
