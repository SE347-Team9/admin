import { Building2, ArrowLeft, Edit, TrendingUp, Clock, CreditCard, AlertTriangle, CheckCircle2, XCircle, BarChart3 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { agencyService } from '../../api/endpoints/agencyService'
import './ViewAgency.css'

// Quy định hệ thống
const REGULATIONS = {
  min_sales_level_1: 100000000,
  min_months_level_1: 6,
  min_payment_rate_level_1: 90,
  min_sales_level_2: 50000000,
  min_months_level_2: 3,
  max_violations: 2,
  discount_level_1: 5,
  discount_level_2: 3,
  discount_level_3: 2,
}

const ViewAgency = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [agency, setAgency] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch agency data on mount
  useEffect(() => {
    if (id) {
      fetchAgency()
    }
  }, [id])

  const fetchAgency = async () => {
    try {
      setLoading(true)
      const response = await agencyService.getById(id!)
      if (response.success) {
        setAgency({
          id: response.data.id,
          code: response.data.code,
          name: response.data.name,
          address: response.data.address,
          phone: response.data.phone || '',
          email: response.data.email || '',
          location: response.data.location || '',
          level: 1,
          levelLabel: 'Cấp 1',
          totalSales: 0,
          debt: 0,
          debtLimit: 50000000,
          status: response.data.status,
          statusLabel: response.data.status === 'active' ? 'Hoạt động' : 'Ngưng hoạt động',
          createdAt: new Date(response.data.createdAt).toLocaleDateString('vi-VN'),
          updatedAt: new Date(response.data.updatedAt).toLocaleDateString('vi-VN'),
          avgMonthlySales: 0,
          monthsActive: 0,
          paymentRate: 0,
          violationCount: 0,
          discount: 2
        })
      }
    } catch (error: any) {
      console.error('Error fetching agency:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount).replace('₫', 'đ')
  }

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(0) + ' triệu'
    }
    return amount.toLocaleString('vi-VN') + 'đ'
  }

  if (loading) {
    return <div className="view-agency-page"><div style={{padding: '2rem', textAlign: 'center'}}>Đang tải...</div></div>
  }

  if (!agency) {
    return <div className="view-agency-page"><div style={{padding: '2rem', textAlign: 'center'}}>Không tìm thấy đại lý</div></div>
  }

  // Tính toán điều kiện
  const salesMet = agency.avgMonthlySales >= REGULATIONS.min_sales_level_1
  const monthsMet = agency.monthsActive >= REGULATIONS.min_months_level_1
  const paymentMet = agency.paymentRate >= REGULATIONS.min_payment_rate_level_1
  const violationMet = agency.violationCount <= REGULATIONS.max_violations
  const totalMet = [salesMet, monthsMet, paymentMet, violationMet].filter(Boolean).length

  const handleBack = () => {
    navigate('/admin/agency-management')
  }

  const handleEdit = () => {
    navigate(`/edit-agency/${agency.id}`)
  }

  return (
    <div className="view-agency-page">
      <div className="view-agency-container">
        {/* Header */}
        <div className="view-agency__header">
          <div className="view-agency__header-icon">
            <Building2 size={36} />
          </div>
          <div className="view-agency__header-content">
            <h1 className="view-agency__title">Chi tiết đại lý</h1>
            <p className="view-agency__subtitle">
              Xem thông tin chi tiết của đại lý trong hệ thống
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="view-agency__content">
          <div className="view-agency__card">
            <h2 className="view-agency__card-title">Thông tin đại lý</h2>
            <div className="view-agency__info-grid">
              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Mã đại lý:</span>
                <span className="view-agency__info-value view-agency__code">{agency.code}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Tên đại lý:</span>
                <span className="view-agency__info-value">{agency.name}</span>
              </div>

              <div className="view-agency__info-item view-agency__info-item--full">
                <span className="view-agency__info-label">Địa chỉ:</span>
                <span className="view-agency__info-value">{agency.address}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Số điện thoại:</span>
                <span className="view-agency__info-value">{agency.phone}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Email:</span>
                <span className="view-agency__info-value">{agency.email}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Cấp đại lý:</span>
                <span className={`view-agency__level-badge level-${agency.level}`}>
                  {agency.levelLabel}
                </span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Doanh số nhập hàng:</span>
                <span className="view-agency__info-value view-agency__sales">{formatCurrency(agency.totalSales)}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Công nợ:</span>
                <div className="view-agency__debt-info">
                  <span className="view-agency__debt-amount">{formatCurrency(agency.debt)}</span>
                  <span className="view-agency__debt-limit">/ {formatCurrency(agency.debtLimit)}</span>
                </div>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Ngày tạo:</span>
                <span className="view-agency__info-value">{agency.createdAt}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Cập nhật lần cuối:</span>
                <span className="view-agency__info-value">{agency.updatedAt}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Trạng thái:</span>
                <span className={`view-agency__status ${agency.status}`}>
                  {agency.statusLabel}
                </span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Chiết khấu:</span>
                <span className="view-agency__discount">{agency.discount}%</span>
              </div>
            </div>
          </div>

          {/* Evaluation Card */}
          <div className="view-agency__card view-agency__evaluation-card">
            <h2 className="view-agency__card-title">
              <BarChart3 size={20} />
              Chỉ số đánh giá cấp đại lý
            </h2>
            <div className="view-agency__score-summary">
              <div className="score-circle">
                <span className="score-value">{totalMet}/4</span>
                <span className="score-label">Tiêu chí đạt</span>
              </div>
              <div className="score-status">
                {totalMet === 4 ? (
                  <span className="status-badge status-qualified">
                    Đủ điều kiện Cấp 1
                  </span>
                ) : agency.level === 1 && totalMet < 3 ? (
                  <span className="status-badge status-warning">
                    Cần xem xét hạ cấp
                  </span>
                ) : (
                  <span className="status-badge status-pending">
                    Chưa đủ điều kiện nâng cấp
                  </span>
                )}
              </div>
            </div>

            <div className="view-agency__metrics-grid">
              <div className={`metric-card ${salesMet ? 'met' : 'not-met'}`}>
                <div className="metric-header">
                  <TrendingUp size={18} />
                  <span>Doanh số trung bình/tháng</span>
                  {salesMet ? <CheckCircle2 size={16} className="check-icon" /> : <XCircle size={16} className="x-icon" />}
                </div>
                <div className="metric-value">{formatShortCurrency(agency.avgMonthlySales)}</div>
                <div className="metric-requirement">Yêu cầu: ≥ {formatShortCurrency(REGULATIONS.min_sales_level_1)}</div>
              </div>

              <div className={`metric-card ${monthsMet ? 'met' : 'not-met'}`}>
                <div className="metric-header">
                  <Clock size={18} />
                  <span>Thời gian hoạt động</span>
                  {monthsMet ? <CheckCircle2 size={16} className="check-icon" /> : <XCircle size={16} className="x-icon" />}
                </div>
                <div className="metric-value">{agency.monthsActive} tháng</div>
                <div className="metric-requirement">Yêu cầu: ≥ {REGULATIONS.min_months_level_1} tháng</div>
              </div>

              <div className={`metric-card ${paymentMet ? 'met' : 'not-met'}`}>
                <div className="metric-header">
                  <CreditCard size={18} />
                  <span>Thanh toán đúng hạn</span>
                  {paymentMet ? <CheckCircle2 size={16} className="check-icon" /> : <XCircle size={16} className="x-icon" />}
                </div>
                <div className="metric-value">{agency.paymentRate}%</div>
                <div className="metric-requirement">Yêu cầu: ≥ {REGULATIONS.min_payment_rate_level_1}%</div>
              </div>

              <div className={`metric-card ${violationMet ? 'met' : 'not-met'}`}>
                <div className="metric-header">
                  <AlertTriangle size={18} />
                  <span>Số lần vi phạm</span>
                  {violationMet ? <CheckCircle2 size={16} className="check-icon" /> : <XCircle size={16} className="x-icon" />}
                </div>
                <div className="metric-value">{agency.violationCount} lần</div>
                <div className="metric-requirement">Yêu cầu: ≤ {REGULATIONS.max_violations} lần</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="view-agency__footer">
          <button className="view-agency__btn view-agency__btn--secondary" onClick={handleBack}>
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>
          <button className="view-agency__btn view-agency__btn--primary" onClick={handleEdit}>
            <Edit size={20} />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewAgency
