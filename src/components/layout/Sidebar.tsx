import { Link, useLocation } from 'react-router-dom'
import { 
  RefreshCw, 
  Package, 
  FileText, 
  BarChart3, 
  CreditCard, 
  Building2,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import './Sidebar.css'

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

const Sidebar = ({ isCollapsed, setIsCollapsed }: SidebarProps) => {
  const location = useLocation()

  const menuItems = [
    {
      id: 'export',
      icon: RefreshCw,
      label: 'Quản lý xuất hàng',
      path: '/export-management'
    },
    {
      id: 'receive',
      icon: Package,
      label: 'Nhận hàng',
      path: '/receive-goods'
    },
    {
      id: 'request',
      icon: FileText,
      label: 'Gửi yêu cầu phân phối',
      path: '/distribution-request'
    },
    {
      id: 'report',
      icon: BarChart3,
      label: 'Lập báo cáo',
      path: '/reports'
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: 'Quản lý thanh toán',
      path: '/payment-management'
    },
    {
      id: 'agency',
      icon: Building2,
      label: 'Quản lý đại lý',
      path: '/agency-management'
    }
  ]

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Home className="logo-icon" size={24} />
          {!isCollapsed && <span className="logo-text">Admin</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <IconComponent className="nav-icon" size={20} />
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
              {!isCollapsed && isActive && <span className="nav-badge">•</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar
