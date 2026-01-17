import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ArrowUp, 
  ArrowDown,
  AlertTriangle,
  Award,
  Clock,
  CreditCard
} from 'lucide-react'
import { toast } from 'react-toastify'
import './AgencyEvaluation.css'

// Quy định hệ thống - sẽ lấy từ API trong thực tế
const REGULATIONS = {
  min_sales_level_1: 100000000, // 100 triệu/tháng
  min_months_level_1: 6, // 6 tháng
  min_payment_rate_level_1: 90, // 90%
  min_sales_level_2: 50000000, // 50 triệu/tháng
  min_months_level_2: 3, // 3 tháng
  max_violations: 2, // Tối đa 2 lần vi phạm
  max_debt_level_1: 100000000,
  max_debt_level_2: 50000000,
  max_debt_level_3: 20000000,
  discount_level_1: 5,
  discount_level_2: 3,
  discount_level_3: 2,
}

interface AgencyEvaluationData {
  id: string
  code: string
  name: string
  currentLevel: 1 | 2 | 3
  currentLevelLabel: string
  // Chỉ số đánh giá
  avgMonthlySales: number
  monthsActive: number
  paymentRate: number
  violationCount: number
  currentDebt: number
  // Kết quả đánh giá
  salesMet: boolean
  monthsMet: boolean
  paymentMet: boolean
  violationMet: boolean
  // Đề xuất
  recommendation: 'upgrade' | 'downgrade' | 'maintain'
  recommendationLabel: string
}

const AgencyEvaluation = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'upgrade' | 'downgrade' | 'all'>('all')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState<AgencyEvaluationData | null>(null)
  const [actionType, setActionType] = useState<'upgrade' | 'downgrade' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock data - Dữ liệu đánh giá đại lý
  const [agencies, setAgencies] = useState<AgencyEvaluationData[]>([
    {
      id: '1',
      code: 'DL001',
      name: 'Đại lý Nghĩa',
      currentLevel: 1,
      currentLevelLabel: 'Cấp 1',
      avgMonthlySales: 150000000,
      monthsActive: 18,
      paymentRate: 95,
      violationCount: 0,
      currentDebt: 25000000,
      salesMet: true,
      monthsMet: true,
      paymentMet: true,
      violationMet: true,
      recommendation: 'maintain',
      recommendationLabel: 'Giữ nguyên cấp'
    },
    {
      id: '2',
      code: 'DL002',
      name: 'Đại lý Đại',
      currentLevel: 1,
      currentLevelLabel: 'Cấp 1',
      avgMonthlySales: 200000000,
      monthsActive: 24,
      paymentRate: 98,
      violationCount: 1,
      currentDebt: 30000000,
      salesMet: true,
      monthsMet: true,
      paymentMet: true,
      violationMet: true,
      recommendation: 'maintain',
      recommendationLabel: 'Giữ nguyên cấp'
    },
    {
      id: '3',
      code: 'DL003',
      name: 'Đại lý An Khang',
      currentLevel: 2,
      currentLevelLabel: 'Cấp 2',
      avgMonthlySales: 120000000,
      monthsActive: 8,
      paymentRate: 92,
      violationCount: 1,
      currentDebt: 10000000,
      salesMet: true,
      monthsMet: true,
      paymentMet: true,
      violationMet: true,
      recommendation: 'upgrade',
      recommendationLabel: 'Đề xuất nâng cấp'
    },
    {
      id: '4',
      code: 'DL004',
      name: 'Đại lý Minh Phát',
      currentLevel: 2,
      currentLevelLabel: 'Cấp 2',
      avgMonthlySales: 135000000,
      monthsActive: 10,
      paymentRate: 96,
      violationCount: 0,
      currentDebt: 15000000,
      salesMet: true,
      monthsMet: true,
      paymentMet: true,
      violationMet: true,
      recommendation: 'upgrade',
      recommendationLabel: 'Đề xuất nâng cấp'
    },
    {
      id: '5',
      code: 'DL005',
      name: 'Đại lý Thái Hà',
      currentLevel: 1,
      currentLevelLabel: 'Cấp 1',
      avgMonthlySales: 45000000,
      monthsActive: 12,
      paymentRate: 75,
      violationCount: 3,
      currentDebt: 45000000,
      salesMet: false,
      monthsMet: true,
      paymentMet: false,
      violationMet: false,
      recommendation: 'downgrade',
      recommendationLabel: 'Cần xem xét hạ cấp'
    },
    {
      id: '6',
      code: 'DL006',
      name: 'Đại lý Hoàng Long',
      currentLevel: 2,
      currentLevelLabel: 'Cấp 2',
      avgMonthlySales: 60000000,
      monthsActive: 4,
      paymentRate: 88,
      violationCount: 0,
      currentDebt: 8000000,
      salesMet: false,
      monthsMet: false,
      paymentMet: false,
      violationMet: true,
      recommendation: 'maintain',
      recommendationLabel: 'Giữ nguyên cấp'
    },
    {
      id: '7',
      code: 'DL007',
      name: 'Đại lý Sài Gòn Mới',
      currentLevel: 3,
      currentLevelLabel: 'Cấp 3',
      avgMonthlySales: 55000000,
      monthsActive: 3,
      paymentRate: 93,
      violationCount: 0,
      currentDebt: 5000000,
      salesMet: true,
      monthsMet: true,
      paymentMet: true,
      violationMet: true,
      recommendation: 'upgrade',
      recommendationLabel: 'Đề xuất nâng lên Cấp 2'
    },
    {
      id: '8',
      code: 'DL008',
      name: 'Đại lý Hà Nội Phát Triển',
      currentLevel: 3,
      currentLevelLabel: 'Cấp 3',
      avgMonthlySales: 25000000,
      monthsActive: 1,
      paymentRate: 100,
      violationCount: 0,
      currentDebt: 2000000,
      salesMet: false,
      monthsMet: false,
      paymentMet: true,
      violationMet: true,
      recommendation: 'maintain',
      recommendationLabel: 'Giữ nguyên cấp'
    }
  ])

  // Thống kê
  const stats = useMemo(() => {
    const upgradeCount = agencies.filter(a => a.recommendation === 'upgrade').length
    const downgradeCount = agencies.filter(a => a.recommendation === 'downgrade').length
    const maintainCount = agencies.filter(a => a.recommendation === 'maintain').length
    const level1Count = agencies.filter(a => a.currentLevel === 1).length
    const level2Count = agencies.filter(a => a.currentLevel === 2).length
    const level3Count = agencies.filter(a => a.currentLevel === 3).length
    return { upgradeCount, downgradeCount, maintainCount, level1Count, level2Count, level3Count }
  }, [agencies])

  // Lọc theo tab
  const filteredAgencies = useMemo(() => {
    switch (activeTab) {
      case 'upgrade':
        return agencies.filter(a => a.recommendation === 'upgrade')
      case 'downgrade':
        return agencies.filter(a => a.recommendation === 'downgrade')
      default:
        return agencies
    }
  }, [agencies, activeTab])

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(0) + ' triệu'
    }
    return amount.toLocaleString('vi-VN') + 'đ'
  }

  const handleViewAgency = (id: string) => {
    navigate(`/view-agency/${id}`)
  }

  const handleUpgrade = (agency: AgencyEvaluationData) => {
    setSelectedAgency(agency)
    setActionType('upgrade')
    setShowConfirmModal(true)
  }

  const handleDowngrade = (agency: AgencyEvaluationData) => {
    setSelectedAgency(agency)
    setActionType('downgrade')
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedAgency || !actionType) return

    setIsProcessing(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Update agency
    setAgencies(prev => prev.map(a => {
      if (a.id === selectedAgency.id) {
        const newLevel = actionType === 'upgrade' ? 1 : 2
        return {
          ...a,
          currentLevel: newLevel as 1 | 2,
          currentLevelLabel: `Cấp ${newLevel}`,
          recommendation: 'maintain' as const,
          recommendationLabel: 'Giữ nguyên cấp'
        }
      }
      return a
    }))

    const actionText = actionType === 'upgrade' ? 'Nâng cấp' : 'Hạ cấp'
    const newLevel = actionType === 'upgrade' ? 'Cấp 1' : 'Cấp 2'
    toast.success(`${actionText} ${selectedAgency.name} lên ${newLevel} thành công!`)

    setIsProcessing(false)
    setShowConfirmModal(false)
    setSelectedAgency(null)
    setActionType(null)
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setSelectedAgency(null)
    setActionType(null)
  }

  return (
    <div className="agency-evaluation-page">
      {/* Header */}
      <div className="evaluation-header">
        <div className="header-icon-box">
          <Award size={36} />
        </div>
        <div className="header-text">
          <h1 className="evaluation-title">Đánh giá & Nâng cấp đại lý</h1>
          <p className="evaluation-subtitle">
            Xem xét và phê duyệt nâng/hạ cấp đại lý dựa trên tiêu chí quy định
          </p>
        </div>
      </div>

      {/* Tiêu chí đánh giá */}
      <div className="evaluation-criteria-card">
        <h3 className="criteria-title">📋 Tiêu chí nâng cấp lên Cấp 1 (từ Cấp 2)</h3>
        <div className="criteria-grid">
          <div className="criteria-item">
            <TrendingUp size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Doanh số trung bình/tháng</span>
              <span className="criteria-value">≥ {formatCurrency(REGULATIONS.min_sales_level_1)}</span>
            </div>
          </div>
          <div className="criteria-item">
            <Clock size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thời gian hoạt động</span>
              <span className="criteria-value">≥ {REGULATIONS.min_months_level_1} tháng</span>
            </div>
          </div>
          <div className="criteria-item">
            <CreditCard size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thanh toán đúng hạn</span>
              <span className="criteria-value">≥ {REGULATIONS.min_payment_rate_level_1}%</span>
            </div>
          </div>
          <div className="criteria-item">
            <AlertTriangle size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Số lần vi phạm</span>
              <span className="criteria-value">≤ {REGULATIONS.max_violations} lần</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tiêu chí nâng lên Cấp 2 */}
      <div className="evaluation-criteria-card">
        <h3 className="criteria-title">📋 Tiêu chí nâng cấp lên Cấp 2 (từ Cấp 3)</h3>
        <div className="criteria-grid">
          <div className="criteria-item">
            <TrendingUp size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Doanh số trung bình/tháng</span>
              <span className="criteria-value">≥ {formatCurrency(REGULATIONS.min_sales_level_2)}</span>
            </div>
          </div>
          <div className="criteria-item">
            <Clock size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thời gian hoạt động</span>
              <span className="criteria-value">≥ {REGULATIONS.min_months_level_2} tháng</span>
            </div>
          </div>
          <div className="criteria-item">
            <CreditCard size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thanh toán đúng hạn</span>
              <span className="criteria-value">≥ {REGULATIONS.min_payment_rate_level_1}%</span>
            </div>
          </div>
          <div className="criteria-item">
            <AlertTriangle size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Số lần vi phạm</span>
              <span className="criteria-value">≤ {REGULATIONS.max_violations} lần</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="evaluation-tabs">
        <button 
          className={'tab-btn' + (activeTab === 'all' ? ' active' : '')}
          onClick={() => setActiveTab('all')}
        >
          Tất cả ({agencies.length})
        </button>
        <button 
          className={'tab-btn tab-upgrade' + (activeTab === 'upgrade' ? ' active' : '')}
          onClick={() => setActiveTab('upgrade')}
        >
          <ArrowUp size={16} />
          Đủ điều kiện nâng cấp ({stats.upgradeCount})
        </button>
        <button 
          className={'tab-btn tab-downgrade' + (activeTab === 'downgrade' ? ' active' : '')}
          onClick={() => setActiveTab('downgrade')}
        >
          <ArrowDown size={16} />
          Cần xem xét hạ cấp ({stats.downgradeCount})
        </button>
      </div>

      {/* Agency List */}
      <div className="evaluation-list">
        {filteredAgencies.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={64} />
            <p>Không có đại lý nào trong danh mục này</p>
          </div>
        ) : (
          filteredAgencies.map((agency) => (
            <div key={agency.id} className={`evaluation-card ${agency.recommendation}`}>
              <div className="card-header">
                <div className="agency-info">
                  <span className="agency-code">{agency.code}</span>
                  <h3 className="agency-name">{agency.name}</h3>
                  <span className={`level-badge level-${agency.currentLevel}`}>
                    {agency.currentLevelLabel}
                  </span>
                </div>
                <div className={`recommendation-badge ${agency.recommendation}`}>
                  {agency.recommendation === 'upgrade' && <ArrowUp size={16} />}
                  {agency.recommendation === 'downgrade' && <ArrowDown size={16} />}
                  {agency.recommendation === 'maintain' && <CheckCircle2 size={16} />}
                  {agency.recommendationLabel}
                </div>
              </div>

              <div className="metrics-grid">
                <div className={`metric-item ${agency.salesMet ? 'met' : 'not-met'}`}>
                  <div className="metric-header">
                    <TrendingUp size={16} />
                    <span>Doanh số trung bình/tháng</span>
                    {agency.salesMet ? <CheckCircle2 size={14} className="status-icon" /> : <XCircle size={14} className="status-icon" />}
                  </div>
                  <div className="metric-value">{formatCurrency(agency.avgMonthlySales)}</div>
                  <div className="metric-target">Yêu cầu: ≥ {formatCurrency(REGULATIONS.min_sales_level_1)}</div>
                </div>

                <div className={`metric-item ${agency.monthsMet ? 'met' : 'not-met'}`}>
                  <div className="metric-header">
                    <Clock size={16} />
                    <span>Thời gian hoạt động</span>
                    {agency.monthsMet ? <CheckCircle2 size={14} className="status-icon" /> : <XCircle size={14} className="status-icon" />}
                  </div>
                  <div className="metric-value">{agency.monthsActive} tháng</div>
                  <div className="metric-target">Yêu cầu: ≥ {REGULATIONS.min_months_level_1} tháng</div>
                </div>

                <div className={`metric-item ${agency.paymentMet ? 'met' : 'not-met'}`}>
                  <div className="metric-header">
                    <CreditCard size={16} />
                    <span>Thanh toán đúng hạn</span>
                    {agency.paymentMet ? <CheckCircle2 size={14} className="status-icon" /> : <XCircle size={14} className="status-icon" />}
                  </div>
                  <div className="metric-value">{agency.paymentRate}%</div>
                  <div className="metric-target">Yêu cầu: ≥ {REGULATIONS.min_payment_rate_level_1}%</div>
                </div>

                <div className={`metric-item ${agency.violationMet ? 'met' : 'not-met'}`}>
                  <div className="metric-header">
                    <AlertTriangle size={16} />
                    <span>Số lần vi phạm</span>
                    {agency.violationMet ? <CheckCircle2 size={14} className="status-icon" /> : <XCircle size={14} className="status-icon" />}
                  </div>
                  <div className="metric-value">{agency.violationCount} lần</div>
                  <div className="metric-target">Yêu cầu: ≤ {REGULATIONS.max_violations} lần</div>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-view" onClick={() => handleViewAgency(agency.id)} title="Xem chi tiết">
                  <Eye size={20} />
                </button>
                {agency.recommendation === 'upgrade' && (
                  <button className="btn-upgrade" onClick={() => handleUpgrade(agency)}>
                    <ArrowUp size={16} />
                    Nâng lên Cấp 1
                  </button>
                )}
                {agency.recommendation === 'downgrade' && (
                  <button className="btn-downgrade" onClick={() => handleDowngrade(agency)}>
                    <ArrowDown size={16} />
                    Hạ xuống Cấp 2
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && selectedAgency && (
        <div className="modal-overlay" onClick={handleCancelAction}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={`modal-icon ${actionType}`}>
              {actionType === 'upgrade' ? <ArrowUp size={32} /> : <ArrowDown size={32} />}
            </div>
            <h2 className="modal-title">
              {actionType === 'upgrade' ? 'Xác nhận nâng cấp đại lý' : 'Xác nhận hạ cấp đại lý'}
            </h2>
            <p className="modal-desc">
              Bạn có chắc muốn {actionType === 'upgrade' ? 'nâng cấp' : 'hạ cấp'} đại lý <strong>{selectedAgency.name}</strong>?
            </p>
            
            <div className="modal-change-info">
              <div className="change-item">
                <span className="change-label">Cấp hiện tại:</span>
                <span className={`level-badge level-${selectedAgency.currentLevel}`}>
                  {selectedAgency.currentLevelLabel}
                </span>
              </div>
              <div className="change-arrow">→</div>
              <div className="change-item">
                <span className="change-label">Cấp mới:</span>
                <span className={`level-badge level-${actionType === 'upgrade' ? 1 : 2}`}>
                  Cấp {actionType === 'upgrade' ? '1' : '2'}
                </span>
              </div>
            </div>

            <div className="modal-benefits">
              <h4>{actionType === 'upgrade' ? 'Quyền lợi sau khi nâng cấp:' : 'Thay đổi sau khi hạ cấp:'}</h4>
              <ul>
                <li>
                  Hạn mức nợ: {formatCurrency(actionType === 'upgrade' ? REGULATIONS.max_debt_level_2 : REGULATIONS.max_debt_level_1)} 
                  → {formatCurrency(actionType === 'upgrade' ? REGULATIONS.max_debt_level_1 : REGULATIONS.max_debt_level_2)}
                </li>
                <li>
                  Chiết khấu: {actionType === 'upgrade' ? REGULATIONS.discount_level_2 : REGULATIONS.discount_level_1}% 
                  → {actionType === 'upgrade' ? REGULATIONS.discount_level_1 : REGULATIONS.discount_level_2}%
                </li>
              </ul>
            </div>

            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={handleCancelAction} disabled={isProcessing}>
                Hủy bỏ
              </button>
              <button 
                className={`btn-modal-confirm ${actionType}`} 
                onClick={handleConfirmAction}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {actionType === 'upgrade' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                    Xác nhận {actionType === 'upgrade' ? 'nâng cấp' : 'hạ cấp'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgencyEvaluation
