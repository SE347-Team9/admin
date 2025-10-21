import { Bell, User } from 'lucide-react'
import './Header.css'

interface HeaderProps {
  isCollapsed: boolean
}

const Header = ({ isCollapsed }: HeaderProps) => {
  return (
    <header className={`app-header ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-content">
        <div className="header-left">
          {/* Có thể thêm breadcrumb hoặc search ở đây */}
        </div>
        <div className="header-right">
          <button className="header-icon-btn">
            <Bell size={20} />
          </button>
          <div className="user-profile">
            <div className="user-avatar">
              <User size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
