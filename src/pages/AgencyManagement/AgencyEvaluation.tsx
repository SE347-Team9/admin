import { useEffect, useMemo, useState } from "react"
import { TrendingUp, CheckCircle2, Eye, ArrowUp, ArrowDown, AlertTriangle, Award, Clock, CreditCard } from "lucide-react"
import { toast } from "react-toastify"
import { agencyService } from "../../api/endpoints/agencyService"
import "./AgencyEvaluation.css"

const REGULATIONS = {
  min_sales_level_1: 100000000,
  min_months_level_1: 6,
  min_payment_rate_level_1: 90,
  min_sales_level_2: 50000000,
  min_months_level_2: 3,
  max_violations: 2,
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
  avgMonthlySales: number
  monthsActive: number
  paymentRate: number
  violationCount: number
  currentDebt: number
  salesMet: boolean
  monthsMet: boolean
  paymentMet: boolean
  violationMet: boolean
  recommendation: "upgrade" | "downgrade" | "maintain"
  recommendationLabel: string
}

const AgencyEvaluation = () => {
  const [activeTab, setActiveTab] = useState<"upgrade" | "downgrade" | "all">("all")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState<AgencyEvaluationData | null>(null)
  const [actionType, setActionType] = useState<"upgrade" | "downgrade" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [agencies, setAgencies] = useState<AgencyEvaluationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAgencies()
  }, [])

  const loadAgencies = async () => {
    try {
      setLoading(true)
      const response = await agencyService.getAll()
      if (response.success && response.data) {
        const evaluationData: AgencyEvaluationData[] = response.data.map((agency: any) => ({
          id: agency.id,
          code: agency.code,
          name: agency.name,
          currentLevel: 1,
          currentLevelLabel: "Cap 1",
          avgMonthlySales: 0,
          monthsActive: 1,
          paymentRate: 90,
          violationCount: 0,
          currentDebt: 0,
          salesMet: false,
          monthsMet: true,
          paymentMet: true,
          violationMet: true,
          recommendation: "maintain",
          recommendationLabel: "Giu nguyen cap",
        }))
        setAgencies(evaluationData)
      }
    } catch (error) {
      console.error("Error loading agencies:", error)
      toast.error("Khong the tai danh sach dai ly")
    } finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    const upgradeCount = agencies.filter(a => a.recommendation === "upgrade").length
    const downgradeCount = agencies.filter(a => a.recommendation === "downgrade").length
    const maintainCount = agencies.filter(a => a.recommendation === "maintain").length
    const level1Count = agencies.filter(a => a.currentLevel === 1).length
    const level2Count = agencies.filter(a => a.currentLevel === 2).length
    const level3Count = agencies.filter(a => a.currentLevel === 3).length
    return { upgradeCount, downgradeCount, maintainCount, level1Count, level2Count, level3Count }
  }, [agencies])

  const filteredAgencies = useMemo(() => {
    switch (activeTab) {
      case "upgrade":
        return agencies.filter(a => a.recommendation === "upgrade")
      case "downgrade":
        return agencies.filter(a => a.recommendation === "downgrade")
      default:
        return agencies
    }
  }, [agencies, activeTab])

  const formatCurrency = (amount: number) => `${new Intl.NumberFormat("vi-VN").format(amount)} ?`

  const handleViewAgency = (id: string) => {
    console.log("View agency details", id)
  }

  const handleUpgrade = (agency: AgencyEvaluationData) => {
    setSelectedAgency(agency)
    setActionType("upgrade")
    setShowConfirmModal(true)
  }

  const handleDowngrade = (agency: AgencyEvaluationData) => {
    setSelectedAgency(agency)
    setActionType("downgrade")
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedAgency || !actionType) return
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setAgencies(prev => prev.map(a => {
      if (a.id === selectedAgency.id) {
        const newLevel = actionType === "upgrade" ? 1 : 2
        return {
          ...a,
          currentLevel: newLevel,
          currentLevelLabel: `Cap ${newLevel}`,
          recommendation: "maintain",
          recommendationLabel: "Giu nguyen cap",
        }
      }
      return a
    }))
    const actionText = actionType === "upgrade" ? "Nang cap" : "Ha cap"
    const newLevelLabel = actionType === "upgrade" ? "Cap 1" : "Cap 2"
    toast.success(`${actionText} ${selectedAgency.name} len ${newLevelLabel} thanh cong!`)
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

  if (loading) {
    return (
      <div className="agency-evaluation-page">
        <div className="evaluation-header">
          <p>Dang tai du lieu danh gia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="agency-evaluation-page">
      <div className="evaluation-header">
        <div className="header-icon-box">
          <Award size={36} />
        </div>
        <div className="header-text">
          <h1 className="evaluation-title">Danh gia & Nang cap dai ly</h1>
          <p className="evaluation-subtitle">Xem xet va phe duyet nang/ha cap dai ly dua tren tieu chi quy dinh</p>
        </div>
      </div>

      <div className="evaluation-criteria-card">
        <h3 className="criteria-title"> Tieu chi nang cap len Cap 1 (tu Cap 2)</h3>
        <div className="criteria-grid">
          <div className="criteria-item">
            <TrendingUp size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Doanh so trung binh/thang</span>
              <span className="criteria-value"> {formatCurrency(REGULATIONS.min_sales_level_1)}</span>
            </div>
          </div>
          <div className="criteria-item">
            <Clock size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thoi gian hoat dong</span>
              <span className="criteria-value"> {REGULATIONS.min_months_level_1} thang</span>
            </div>
          </div>
          <div className="criteria-item">
            <CreditCard size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thanh toan dung han</span>
              <span className="criteria-value"> {REGULATIONS.min_payment_rate_level_1}%</span>
            </div>
          </div>
          <div className="criteria-item">
            <AlertTriangle size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">So lan vi pham</span>
              <span className="criteria-value"> {REGULATIONS.max_violations} lan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="evaluation-criteria-card">
        <h3 className="criteria-title"> Tieu chi nang cap len Cap 2 (tu Cap 3)</h3>
        <div className="criteria-grid">
          <div className="criteria-item">
            <TrendingUp size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Doanh so trung binh/thang</span>
              <span className="criteria-value"> {formatCurrency(REGULATIONS.min_sales_level_2)}</span>
            </div>
          </div>
          <div className="criteria-item">
            <Clock size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thoi gian hoat dong</span>
              <span className="criteria-value"> {REGULATIONS.min_months_level_2} thang</span>
            </div>
          </div>
          <div className="criteria-item">
            <CreditCard size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">Thanh toan dung han</span>
              <span className="criteria-value"> {REGULATIONS.min_payment_rate_level_1}%</span>
            </div>
          </div>
          <div className="criteria-item">
            <AlertTriangle size={20} className="criteria-icon" />
            <div className="criteria-content">
              <span className="criteria-label">So lan vi pham</span>
              <span className="criteria-value"> {REGULATIONS.max_violations} lan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="evaluation-tabs">
        <button className={`tab-btn${activeTab === "all" ? " active" : ""}`} onClick={() => setActiveTab("all")}>
          Tat ca ({agencies.length})
        </button>
        <button className={`tab-btn tab-upgrade${activeTab === "upgrade" ? " active" : ""}`} onClick={() => setActiveTab("upgrade")}>
          <ArrowUp size={16} />
          Du dieu kien nang cap ({stats.upgradeCount})
        </button>
        <button className={`tab-btn tab-downgrade${activeTab === "downgrade" ? " active" : ""}`} onClick={() => setActiveTab("downgrade")}>
          <ArrowDown size={16} />
          Can xem xet ha cap ({stats.downgradeCount})
        </button>
      </div>

      <div className="evaluation-list">
        {filteredAgencies.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={64} />
            <p>Khong co dai ly nao trong danh muc nay</p>
          </div>
        ) : (
          filteredAgencies.map((agency) => (
            <div key={agency.id} className={`evaluation-card ${agency.recommendation}`}>
              <div className="eval-card-header">
                <div className="eval-card-title">
                  <h3>{agency.name}</h3>
                  <span className={`level-badge level-${agency.currentLevel}`}>{agency.currentLevelLabel}</span>
                </div>
                <div className={`recommendation-badge ${agency.recommendation}`}>
                  {agency.recommendation === "upgrade" ? <ArrowUp size={16} /> : agency.recommendation === "downgrade" ? <ArrowDown size={16} /> : <CheckCircle2 size={16} />}
                  {agency.recommendationLabel}
                </div>
              </div>

              <div className="eval-card-body">
                <div className="metric">
                  <span className="metric-label">Doanh so TB/thang</span>
                  <span className="metric-value">{formatCurrency(agency.avgMonthlySales)}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">So thang hoat dong</span>
                  <span className="metric-value">{agency.monthsActive} thang</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Ty le thanh toan</span>
                  <span className={`metric-value ${agency.paymentMet ? "text-success" : "text-warning"}`}>{agency.paymentRate}%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">So lan vi pham</span>
                  <span className={`metric-value ${agency.violationMet ? "text-success" : "text-danger"}`}>{agency.violationCount} lan</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Cong no hien tai</span>
                  <span className="metric-value">{formatCurrency(agency.currentDebt)}</span>
                </div>
              </div>

              <div className="eval-card-footer">
                <button className="btn-view" onClick={() => handleViewAgency(agency.id)}>
                  <Eye size={16} /> Xem chi tiet
                </button>
                {agency.recommendation === "upgrade" ? (
                  <button className="btn-upgrade" onClick={() => handleUpgrade(agency)}>
                    <ArrowUp size={16} /> Nang cap
                  </button>
                ) : (
                  <button className="btn-downgrade" onClick={() => handleDowngrade(agency)}>
                    <ArrowDown size={16} /> Ha cap
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showConfirmModal && selectedAgency && (
        <div className="modal-overlay" onClick={handleCancelAction}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className={`modal-icon ${actionType}`}>
              {actionType === "upgrade" ? <ArrowUp size={32} /> : <ArrowDown size={32} />}
            </div>
            <h2 className="modal-title">
              {actionType === "upgrade" ? "Xac nhan nang cap dai ly" : "Xac nhan ha cap dai ly"}
            </h2>
            <p className="modal-desc">
              Ban co chac muon {actionType === "upgrade" ? "nang cap" : "ha cap"} dai ly <strong>{selectedAgency.name}</strong>?
            </p>

            <div className="modal-change-info">
              <div className="change-item">
                <span className="change-label">Cap hien tai:</span>
                <span className={`level-badge level-${selectedAgency.currentLevel}`}>
                  {selectedAgency.currentLevelLabel}
                </span>
              </div>
              <div className="change-arrow"></div>
              <div className="change-item">
                <span className="change-label">Cap moi:</span>
                <span className={`level-badge level-${actionType === "upgrade" ? 1 : 2}`}>
                  Cap {actionType === "upgrade" ? "1" : "2"}
                </span>
              </div>
            </div>

            <div className="modal-benefits">
              <h4>{actionType === "upgrade" ? "Quyen loi sau khi nang cap:" : "Thay doi sau khi ha cap:"}</h4>
              <ul>
                <li>
                  Han muc no: {formatCurrency(actionType === "upgrade" ? REGULATIONS.max_debt_level_2 : REGULATIONS.max_debt_level_1)} {' -> '} {formatCurrency(actionType === "upgrade" ? REGULATIONS.max_debt_level_1 : REGULATIONS.max_debt_level_2)}
                </li>
                <li>
                  Chiet khau: {actionType === "upgrade" ? REGULATIONS.discount_level_2 : REGULATIONS.discount_level_1}% {' -> '} {actionType === "upgrade" ? REGULATIONS.discount_level_1 : REGULATIONS.discount_level_2}%
                </li>
              </ul>
            </div>

            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={handleCancelAction} disabled={isProcessing}>
                Huy bo
              </button>
              <button className={`btn-modal-confirm ${actionType}`} onClick={handleConfirmAction} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Dang xu ly...
                  </>
                ) : (
                  <>
                    {actionType === "upgrade" ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                    Xac nhan {actionType === "upgrade" ? "nang cap" : "ha cap"}
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
