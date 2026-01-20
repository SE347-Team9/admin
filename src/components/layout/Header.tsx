import { Bell, User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { authService } from '../../api/endpoints/authService'
import socketService from '../../services/socketService'
import './Header.css'

interface HeaderProps {
  isCollapsed: boolean
}

const Header = ({ isCollapsed }: HeaderProps) => {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const user = authService.getCurrentUser()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleLogout = () => {
    // Disconnect socket
    socketService.disconnect()
    // Logout
    authService.logout()
    // Redirect to login
    navigate('/login')
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'staff':
        return 'Nhân viên'
      case 'agency':
        return 'Đại lý'
      default:
        return role
    }
  }

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
          <div className="user-profile" ref={dropdownRef}>
            <button 
              className="user-avatar-btn" 
              onClick={() => setShowDropdown(!showDropdown)}
              title="Thông tin tài khoản"
            >
              <div className="user-avatar">
                <User size={20} />
              </div>
            </button>
            
            {showDropdown && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-dropdown-avatar">
                    <User size={24} />
                  </div>
                  <div className="user-dropdown-info">
                    <div className="user-dropdown-name">{user?.username || 'User'}</div>
                    <div className="user-dropdown-role">{getRoleText(user?.role || '')}</div>
                  </div>
                </div>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
