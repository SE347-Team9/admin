import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ArrowLeft, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import regulationService from '../../api/endpoints/regulationService'
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
  const [regulationData, setRegulationData] = useState<RegulationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRegulation()
  }, [id])

  const loadRegulation = async () => {
    try {
      setLoading(true)
      const response = await regulationService.getById(id!)
      if (response.success && response.data) {
        const reg = response.data
        setRegulationData({
          id: reg.id?.toString() || id!,
          code: reg.code,
          value: reg.value,
          description: reg.description,
          lastUpdated: new Date(reg.updated_at || reg.created_at).toLocaleString('vi-VN'),
          notes: 'Quy định trong hệ thống'
        })
      }
    } catch (error) {
      console.error('Error loading regulation:', error)
      toast.error('Không thể tải thông tin quy định')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="view-regulation-page"><p>Đang tải...</p></div>
  }

  if (!regulationData) {
    return <div className="view-regulation-page"><p>Không tìm thấy quy định</p></div>
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const handleBack = () => {
    navigate('/admin/regulations')
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
