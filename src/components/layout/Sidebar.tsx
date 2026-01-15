import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  BookOpen,
  Building2,
  Users,
  Truck,
  Boxes,
  Package,
  Warehouse,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Sidebar.css";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    {
      id: "home",
      icon: Home,
      label: "Trang chủ",
      path: "/home",
    },
    {
      id: "report",
      icon: BarChart3,
      label: "Lập báo cáo",
      path: "/reports",
    },
    {
      id: "regulations",
      icon: BookOpen,
      label: "Quản lý quy định",
      path: "/regulations",
    },
    {
      id: "agency",
      icon: Building2,
      label: 'Quản lý đại lý',
      path: '/agency-management'
    },
    {
      id: 'product',
      icon: Boxes,
      label: 'Quản lý sản phẩm',
      path: '/product-management'
    },
    {
      id: 'supplier',
      icon: Package,
      label: 'Quản lý NCC',
      path: '/supplier-management'
    },
    {
      id: 'inventory',
      icon: Warehouse,
      label: 'Giám sát kho',
      path: '/inventory-overview'
    },
    {
      id: 'delivery',
      icon: Truck,
      label: 'Quản lý giao hàng',
      path: '/delivery-management'
    },
    {
      id: "account",
      icon: Users,
      label: "Quản lý tài khoản",
      path: "/account-management",
    },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Home className="logo-icon" size={24} />
          {!isCollapsed && <span className="logo-text">Admin</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <IconComponent className="nav-icon" size={20} />
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
              {!isCollapsed && isActive && <span className="nav-badge">•</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
