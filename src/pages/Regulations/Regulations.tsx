import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Eye, Search, Edit, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import regulationService from '../../api/endpoints/regulationService'
import './Regulations.css'

interface Regulation {
  id: string
  code: string
  value: number
  description: string
  lastUpdated: string
}

const Regulations = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteRegulation, setDeleteRegulation] = useState<Regulation | null>(null)
  const [regulations, setRegulations] = useState<Regulation[]>([])

  useEffect(() => {
    loadRegulations()
  }, [])

  const loadRegulations = async () => {
    try {
      const response = await regulationService.getAll()
      if (response.success && response.data) {
        const regulationData = response.data.map((reg: any) => {
          // Format date to DD-MM-YYYY
          let formattedDate = 'Invalid Date'
          if (reg.updatedAt || reg.updated_at) {
            const date = new Date(reg.updatedAt || reg.updated_at)
            if (!isNaN(date.getTime())) {
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const year = date.getFullYear()
              formattedDate = `${day}-${month}-${year}`
            }
          }
          
          return {
            id: reg.key || reg.id,
            code: reg.key || reg.code,
            value: reg.value,
            description: reg.description || '',
            lastUpdated: formattedDate
          }
        })
        setRegulations(regulationData)
      }
    } catch (error) {
      console.error('Error loading regulations:', error)
      toast.error('Không thể tải danh sách quy định')
    }
  }

  const filteredRegulations = regulations.filter(regulation =>
    (regulation.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (regulation.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const handleView = (id: string) => {
    navigate(`/admin/view-regulation/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/admin/edit-regulation/${id}`)
  }

  const handleDelete = (regulation: Regulation) => {
    setDeleteRegulation(regulation)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteRegulation) {
      setRegulations(prev => prev.filter(reg => reg.id !== deleteRegulation.id))
      toast.success(`Đã xóa quy định ${deleteRegulation.code}`)
    }
    setShowDeleteModal(false)
    setDeleteRegulation(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteRegulation(null)
  }

  return (
    <div className="regulations-page">
      {/* Header Section */}
      <div className="regulations__header">
        <div className="regulations__header-icon">
          <BookOpen size={36} />
        </div>
        <div className="regulations__header-text">
          <h1 className="regulations__title">Quy định hệ thống</h1>
          <p className="regulations__subtitle">Xem các quy định và chính sách được thiết lập bởi quản trị viên</p>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="regulations__actions-card">
        <div className="regulations__search-box">
          <Search className="regulations__search-icon" size={20} />
          <input
            type="text"
            className="regulations__search-input"
            placeholder="Tìm kiếm quy định..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Regulations Table */}
      <div className="regulations__table-card">
        <table className="regulations__table">
          <thead>
            <tr>
              <th className="regulations__col-code">MÃ QUY ĐỊNH</th>
              <th className="regulations__col-value">GIÁ TRỊ / GIỚI HẠN</th>
              <th className="regulations__col-description">MÔ TẢ</th>
              <th className="regulations__col-updated">CẬP NHẬT LẦN CUỐI</th>
              <th className="regulations__col-actions">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegulations.length > 0 ? (
              filteredRegulations.map((regulation) => (
                <tr key={regulation.id}>
                  <td className="regulations__col-code">
                    <span className="regulations__code">{regulation.code}</span>
                  </td>
                  <td className="regulations__col-value">
                    <span className="regulations__value">{formatNumber(regulation.value)}</span>
                  </td>
                  <td className="regulations__col-description">{regulation.description}</td>
                  <td className="regulations__col-updated">{regulation.lastUpdated}</td>
                  <td className="regulations__col-actions">
                    <div className="regulations__action-buttons">
                      <button
                        className="regulations__action-btn regulations__action-btn--view"
                        onClick={() => handleView(regulation.id)}
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="regulations__action-btn regulations__action-btn--edit"
                        onClick={() => handleEdit(regulation.id)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="regulations__action-btn regulations__action-btn--delete"
                        onClick={() => handleDelete(regulation)}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="regulations__no-data">
                  <BookOpen size={48} />
                  <p>Không tìm thấy quy định nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa quy định */}
      {showDeleteModal && deleteRegulation && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content modal-delete-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-delete-modern-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="modal-delete-modern-title">Xác nhận xóa quy định</div>
            <div className="modal-delete-modern-desc">
              Bạn có chắc chắn muốn xóa quy định <b>{deleteRegulation.code}</b>?
            </div>
            <div className="modal-delete-modern-warning">Hành động này không thể hoàn tác.</div>
            <div className="modal-delete-modern-actions">
              <button className="btn-modal-cancel-modern" onClick={handleCancelDelete}>Hủy</button>
              <button className="btn-modal-delete-modern" onClick={handleConfirmDelete}>Xóa quy định</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Regulations
