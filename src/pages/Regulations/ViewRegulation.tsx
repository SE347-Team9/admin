import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ArrowLeft, Edit } from 'lucide-react'
import './ViewRegulation.css'

interface RegulationData {
  id: string
  code: string
  value: number
  description: string
  lastUpdated: string
  notes: string
}

const ViewRegulation = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Mock regulation data - in real app, fetch from API
  const regulationData: RegulationData = {
    id: id || '1',
    code: 'max_debt_level_1',
    value: 100000000,
    description: 'Trần nợ đại lý cấp 1',
    lastUpdated: '21:35 11 thg 7, 2025',
    notes: 'Quy định về trần nợ tối đa cho các đại lý cấp 1 trong hệ thống'
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const handleBack = () => {
    navigate('/regulations')
  }

  const handleEdit = () => {
    navigate(`/edit-regulation/${id}`)
  }

  return (
    <div className="view-regulation-page">
      <div className="view-regulation-container">
        {/* Header */}
        <div className="view-regulation__header">
          <div className="view-regulation__header-icon">
            <BookOpen size={36} />
          </div>
          <div className="view-regulation__header-content">
            <h1 className="view-regulation__title">Chi tiết quy định</h1>
            <p className="view-regulation__subtitle">
              Xem thông tin chi tiết của quy định trong hệ thống
            </p>
          </div>
        </div>

        {/* Content and Footer Combined */}
        <div className="view-regulation__content">
          <div className="view-regulation__card">
            <h2 className="view-regulation__card-title">Thông tin quy định</h2>
            <div className="view-regulation__info-grid">
              <div className="view-regulation__info-item">
                <span className="view-regulation__info-label">Mã quy định:</span>
                <span className="view-regulation__info-value view-regulation__code">
                  {regulationData.code}
                </span>
              </div>

              <div className="view-regulation__info-item">
                <span className="view-regulation__info-label">Giá trị:</span>
                <span className="view-regulation__info-value view-regulation__value">
                  {formatNumber(regulationData.value)}
                </span>
              </div>

              <div className="view-regulation__info-item view-regulation__info-item--full">
                <span className="view-regulation__info-label">Mô tả:</span>
                <span className="view-regulation__info-value">{regulationData.description}</span>
              </div>

              <div className="view-regulation__info-item view-regulation__info-item--full">
                <span className="view-regulation__info-label">Ghi chú:</span>
                <span className="view-regulation__info-value view-regulation__notes">
                  {regulationData.notes}
                </span>
              </div>

              <div className="view-regulation__info-item">
                <span className="view-regulation__info-label">Cập nhật lần cuối:</span>
                <span className="view-regulation__info-value">{regulationData.lastUpdated}</span>
              </div>
            </div>

            {/* Footer Actions - Inside Card */}
            <div className="view-regulation__footer">
              <button className="view-regulation__btn view-regulation__btn--secondary" onClick={handleBack}>
                <ArrowLeft size={20} />
                Quay lại danh sách
              </button>
              <button className="view-regulation__btn view-regulation__btn--primary" onClick={handleEdit}>
                <Edit size={20} />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewRegulation
