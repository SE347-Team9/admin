import { Users, Building2, BookOpen, FileText, LayoutDashboard, TrendingUp, Activity, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const navigate = useNavigate()

  const statistics = [
    {
      id: 'accounts',
      label: 'Tổng tài khoản',
      value: '248',
      icon: Users,
      gradient: 'blue',
      change: '+12.5%'
    },
    {
      id: 'agencies',
      label: 'Đại lý hoạt động',
      value: '156',
      icon: Building2,
      gradient: 'green',
      change: '+8.2%'
    },
    {
      id: 'reports',
      label: 'Báo cáo hôm nay',
      value: '42',
      icon: BarChart3,
      gradient: 'orange',
      change: '+5.4%'
    },
    {
      id: 'activity',
      label: 'Hoạt động',
      value: '98%',
      icon: Activity,
      gradient: 'purple',
      change: '+2.1%'
    }
  ]

  const adminModules = [
    {
      id: 'account',
      icon: Users,
      title: 'Quản lý tài khoản',
      description: 'Quản lý tài khoản người dùng trong hệ thống',
      path: '/account-management',
      color: 'blue'
    },
    {
      id: 'agency',
      icon: Building2,
      title: 'Quản lý đại lý',
      description: 'Quản lý thông tin các đại lý trong hệ thống',
      path: '/agency-management',
      color: 'green'
    },
    {
      id: 'regulations',
      icon: BookOpen,
      title: 'Quy định',
      description: 'Quản lý các quy định và chính sách của hệ thống',
      path: '/regulations',
      color: 'purple'
    },
    {
      id: 'reports',
      icon: FileText,
      title: 'Báo cáo',
      description: 'Xem và quản lý các báo cáo trong hệ thống',
      path: '/reports',
      color: 'orange'
    }
  ]

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-icon-box">
            <LayoutDashboard size={32} />
          </div>
          <div className="header-text">
            <h1 className="page-title">Bảng điều khiển quản trị</h1>
            <p className="page-subtitle">Quản lý toàn bộ hệ thống từ một nơi</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-section">
          <div className="stats-grid">
            {statistics.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.id}
                  className={`stat-card gradient-${stat.gradient}`}
                >
                  <div className="stat-content">
                    <div className="stat-header">
                      <span className="stat-label">{stat.label}</span>
                      <span className="stat-change">
                        <TrendingUp size={14} />
                        {stat.change}
                      </span>
                    </div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                  <div className="stat-icon">
                    <Icon size={48} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Modules Section */}
        <div className="modules-section">
          <div className="section-title">
            <h2>Các chức năng chính</h2>
            <p>Truy cập nhanh vào các module quản lý</p>
          </div>
          <div className="modules-grid">
            {adminModules.map((module) => {
              const Icon = module.icon
              return (
                <button
                  key={module.id}
                  className={`module-card color-${module.color}`}
                  onClick={() => navigate(module.path)}
                >
                  <div className="module-icon-wrapper">
                    <div className="module-icon">
                      <Icon size={32} />
                    </div>
                  </div>
                  <div className="module-content">
                    <h3 className="module-title">{module.title}</h3>
                    <p className="module-description">{module.description}</p>
                  </div>
                  <div className="module-arrow">
                    →
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
