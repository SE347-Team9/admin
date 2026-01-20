import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  TrendingUp,
  CreditCard,
  ArrowRight,
  Package,
  DollarSign,
  Truck,
  Building2
} from 'lucide-react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import dashboardService, { AgencyDashboardStats } from '../../../api/endpoints/dashboardService'
import { toast } from 'react-toastify'
import './AgencyDashboard.css'

const AgencyDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<AgencyDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await dashboardService.getStats()
      if (response.success) {
        setStats(response.data as AgencyDashboardStats)
      } else {
        toast.error(response.message || 'Không thể tải dữ liệu trang chủ')
        // Set default stats to show empty dashboard instead of error
        setStats({
          currentDebt: 0,
          creditLimit: 0,
          monthlyImports: 0,
          monthlyPayments: 0,
          debtTrend: [],
          paymentTrend: []
        })
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      const errorMsg = error.response?.data?.message || 'Không thể tải dữ liệu trang chủ'
      toast.error(errorMsg)
      // Set default stats to show empty dashboard instead of error
      setStats({
        currentDebt: 0,
        creditLimit: 0,
        monthlyImports: 0,
        monthlyPayments: 0,
        debtTrend: [],
        paymentTrend: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="agency-dashboard"><p>Đang tải...</p></div>
  }

  if (!stats) {
    return (
      <div className="agency-dashboard">
        <p>Không thể tải dữ liệu. Vui lòng đăng xuất và đăng nhập lại.</p>
      </div>
    )
  }

  // Format debt trend data for chart
  const debtTrendData = stats.debtTrend.map(item => ({
    month: item.month,
    congNo: parseFloat(item.debt.toString())
  }))

  // Format payment trend data for chart
  const paymentTrendData = stats.paymentTrend.map(item => ({
    month: item.month,
    thanhToan: parseFloat(item.total.toString())
  }))

  // Format số tiền VND
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} tỷ`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} tr`
    }
    return value.toLocaleString('vi-VN')
  }

  // Custom tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="agency-dashboard__tooltip">
          <p className="agency-dashboard__tooltip-label">{`Tháng ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey.includes('phieu') 
                ? `${entry.name}: ${entry.value} phiếu`
                : `${entry.name}: ${entry.value.toLocaleString('vi-VN')} VNĐ`
              }
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const statistics = [
    {
      id: 'imports',
      label: 'Phiếu nhập tháng này',
      value: stats.monthlyImports.toString(),
      icon: Package,
      gradient: 'blue',
      change: '+' + stats.monthlyImports,
      description: 'phiếu nhập hàng'
    },
    {
      id: 'debt',
      label: 'Công nợ cần trả',
      value: formatCurrency(stats.currentDebt),
      icon: DollarSign,
      gradient: 'orange',
      change: formatCurrency(stats.currentDebt),
      description: 'công nợ hiện tại'
    },
    {
      id: 'payments',
      label: 'Đã thanh toán tháng này',
      value: formatCurrency(stats.monthlyPayments),
      icon: CreditCard,
      gradient: 'purple',
      change: '+' + formatCurrency(stats.monthlyPayments),
      description: 'thanh toán tháng này'
    }
  ]

  const quickLinks = [
    {
      id: 'receive',
      icon: Package,
      title: 'Nhận hàng',
      description: 'Quản lý các phiếu nhập hàng',
      path: '/agency/receive-goods',
      color: 'blue'
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Quản lý thanh toán',
      description: 'Ghi nhận các khoản thanh toán',
      path: '/agency/payment-management',
      color: 'purple'
    },
    {
      id: 'distribution',
      icon: Truck,
      title: 'Yêu cầu phân phối',
      description: 'Tạo yêu cầu phân phối hàng hóa',
      path: '/agency/distribution-request',
      color: 'orange'
    },
    {
      id: 'agency',
      icon: Building2,
      title: 'Thông tin đại lý',
      description: 'Xem và cập nhật thông tin đại lý',
      path: '/agency-management',
      color: 'green'
    }
  ]

  return (
    <div className="agency-dashboard-page">
      {/* Header Section */}
      <div className="agency-dashboard__header">
        <div className="agency-dashboard__header-icon">
          <LayoutDashboard size={36} />
        </div>
        <div className="agency-dashboard__header-text">
          <h1 className="agency-dashboard__title">Trang chủ đại lý</h1>
          <p className="agency-dashboard__subtitle">Tổng quan hoạt động kinh doanh của bạn</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="agency-dashboard__stats-grid">
        {statistics.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.id}
              className={`agency-dashboard__stat-card agency-dashboard__stat-card--${stat.gradient}`}
            >
              <div className="agency-dashboard__stat-content">
                <div className="agency-dashboard__stat-header">
                  <span className="agency-dashboard__stat-label">{stat.label}</span>
                  {stat.change && (
                    <span className={`agency-dashboard__stat-change ${stat.change.startsWith('-') ? 'negative' : ''}`}>
                      <TrendingUp size={14} />
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className="agency-dashboard__stat-value">{stat.value}</div>
                <div className="agency-dashboard__stat-description">{stat.description}</div>
              </div>
              <div className="agency-dashboard__stat-icon">
                <Icon size={48} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="agency-dashboard__charts-section">
        {/* Row 2: Line Charts */}
        <div className="agency-dashboard__charts-row">
          {/* Biểu đồ công nợ cần trả */}
          <div className="agency-dashboard__chart-card">
            <div className="agency-dashboard__chart-header">
              <h3 className="agency-dashboard__chart-title">Công nợ cần trả</h3>
              <span className="agency-dashboard__chart-subtitle">6 tháng gần nhất - Tổng nợ cần thanh toán</span>
            </div>
            <div className="agency-dashboard__chart-content">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={debtTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="congNo" 
                    name="Công nợ" 
                    stroke="#fb923c" 
                    strokeWidth={3}
                    dot={{ fill: '#fb923c', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Biểu đồ thanh toán */}
          <div className="agency-dashboard__chart-card">
            <div className="agency-dashboard__chart-header">
              <h3 className="agency-dashboard__chart-title">Thanh toán cho nhà cung cấp</h3>
              <span className="agency-dashboard__chart-subtitle">6 tháng gần nhất - Số tiền đã thanh toán</span>
            </div>
            <div className="agency-dashboard__chart-content">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={paymentTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="thanhToan" 
                    name="Thanh toán" 
                    stroke="#818cf8" 
                    strokeWidth={3}
                    dot={{ fill: '#818cf8', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="agency-dashboard__quick-links">
        <div className="agency-dashboard__section-title">
          <h2>Truy cập nhanh</h2>
          <p>Các chức năng thường dùng</p>
        </div>
        <div className="agency-dashboard__links-grid">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <button
                key={link.id}
                className={`agency-dashboard__link-card agency-dashboard__link-card--${link.color}`}
                onClick={() => navigate(link.path)}
              >
                <div className="agency-dashboard__link-icon">
                  <Icon size={28} />
                </div>
                <div className="agency-dashboard__link-content">
                  <h3 className="agency-dashboard__link-title">{link.title}</h3>
                  <p className="agency-dashboard__link-description">{link.description}</p>
                </div>
                <div className="agency-dashboard__link-arrow">
                  <ArrowRight size={20} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AgencyDashboard



