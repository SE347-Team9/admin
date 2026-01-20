import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { authService } from "../../api/endpoints/authService";
import { getMenuItems, getLogoText } from "../../config/menuConfig";
import "./Sidebar.css";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation();
  const user = authService.getCurrentUser();
  const menuItems = getMenuItems(user?.role || 'admin');
  const logoText = getLogoText(user?.role || 'admin');

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Home className="logo-icon" size={24} />
          {!isCollapsed && <span className="logo-text">{logoText}</span>}
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
