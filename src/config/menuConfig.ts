import {
  Home,
  BarChart3,
  BookOpen,
  Building2,
  Users,
  Truck,
  Boxes,
  Warehouse,
  Package,
  FileText,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

export interface MenuItem {
  id: string;
  icon: any;
  label: string;
  path: string;
}

export const getMenuItems = (role: string): MenuItem[] => {
  switch (role) {
    case 'admin':
      return [
        {
          id: "home",
          icon: Home,
          label: "Trang chủ",
          path: "/admin/home",
        },
        {
          id: "report",
          icon: BarChart3,
          label: "Lập báo cáo",
          path: "/admin/reports",
        },
        {
          id: "regulations",
          icon: BookOpen,
          label: "Quản lý quy định",
          path: "/admin/regulations",
        },
        {
          id: "agency",
          icon: Building2,
          label: 'Quản lý đại lý',
          path: '/admin/agency-management'
        },
        {
          id: 'product-supplier',
          icon: Boxes,
          label: 'Quản lý SP & NCC',
          path: '/admin/product-supplier-management'
        },
        {
          id: 'inventory',
          icon: Warehouse,
          label: 'Giám sát kho',
          path: '/admin/inventory-overview'
        },
        {
          id: "account",
          icon: Users,
          label: "Quản lý tài khoản",
          path: "/admin/account-management",
        },
      ];
    
    case 'staff':
      return [
        {
          id: "home",
          icon: Home,
          label: "Trang chủ",
          path: "/staff/home",
        },
        {
          id: "report",
          icon: BarChart3,
          label: "Báo cáo",
          path: "/staff/reports",
        },
        {
          id: "agency",
          icon: Building2,
          label: 'Quản lý đại lý',
          path: '/staff/agency-management'
        },
        {
          id: 'export',
          icon: Package,
          label: 'Quản lý xuất hàng',
          path: '/staff/export-management'
        },
        {
          id: 'receive',
          icon: ShoppingCart,
          label: 'Nhập hàng',
          path: '/staff/receive-goods'
        },
        {
          id: 'receive-management',
          icon: FileText,
          label: 'Quản lý phiếu nhận',
          path: '/staff/receive-management'
        },
        {
          id: 'warehouse',
          icon: Warehouse,
          label: 'Kho hàng',
          path: '/staff/warehouse-management'
        },
        {
          id: 'payment',
          icon: DollarSign,
          label: 'Thu tiền',
          path: '/staff/payment-management'
        },
        {
          id: "regulations",
          icon: BookOpen,
          label: "Quy định",
          path: "/staff/regulations",
        },
      ];
    
    case 'agency':
      return [
        {
          id: "dashboard",
          icon: TrendingUp,
          label: "Dashboard",
          path: "/agency/dashboard",
        },
        {
          id: "agency-info",
          icon: Building2,
          label: 'Thông tin đại lý',
          path: '/agency/agency-management'
        },
        {
          id: 'distribution',
          icon: Package,
          label: 'Yêu cầu phân phối',
          path: '/agency/distribution-request'
        },
        {
          id: 'receive',
          icon: FileText,
          label: 'Nhận hàng',
          path: '/agency/receive-goods'
        },
        {
          id: 'payment',
          icon: DollarSign,
          label: 'Thanh toán',
          path: '/agency/payment-management'
        },
      ];
    
    default:
      return [];
  }
};

export const getLogoText = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'staff':
      return 'Staff';
    case 'agency':
      return 'Agency';
    default:
      return 'System';
  }
};
