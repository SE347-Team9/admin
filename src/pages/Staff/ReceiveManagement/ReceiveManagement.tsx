import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, RefreshCw, Plus, Search, Eye, Edit, Trash2, TrendingUp, AlertTriangle } from 'lucide-react'
import { toast } from 'react-toastify'
import importService from '../../../api/endpoints/importService'
import './ReceiveManagement.css'

interface ReceiveTicket {
  id: string
  receiveCode: string
  receiveDate: string
}

const ReceiveManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTicket, setDeleteTicket] = useState<ReceiveTicket | null>(null)
  const [tickets, setTickets] = useState<ReceiveTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    try {
      setLoading(true)
      // Phiếu nhận được tạo thủ công, không tự động từ phiếu nhập
      // TODO: Implement API riêng cho phiếu nhận khi cần
      setTickets([])
    } catch (error) {
      console.error('Error loading tickets:', error)
      toast.error('Không thể tải danh sách phiếu nhận')
    } finally {
      setLoading(false)
    }
  }

  const totalReceive = tickets.length
  const totalThisMonth = 3

  const filteredTickets = tickets.filter(ticket =>
    ticket.receiveCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.importCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (id: string) => {
    navigate(`/receive-order/view/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/receive-order/edit/${id}`)
  }

  const handleDelete = (ticket: ReceiveTicket) => {
    setDeleteTicket(ticket)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteTicket) {
      setTickets(prev => prev.filter(t => t.id !== deleteTicket.id))
      toast.success('Đã xóa phiếu nhận thành công!')
    }
    setShowDeleteModal(false)
    setDeleteTicket(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteTicket(null)
  }

  const handleCreateTicket = () => {
    navigate('/staff/create-receive-order')
  }

  const handleRefresh = () => {
    toast.info('Làm mới dữ liệu')
  }

  return (
    <div className="receive-management-page">
      {/* Header Section */}
      <div className="receive-management__header">
        <div className="receive-management__header-icon">
          <Package size={36} />
        </div>
        <div className="receive-management__header-text">
          <h1 className="receive-management__title">Quản lý Nhận hàng</h1>
          <p className="receive-management__subtitle">Quản lý phiếu nhận và theo dõi quá trình nhận hàng</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="receive-management__stats-grid">
        <div className="receive-management__stat-card receive-management__stat-card--blue">
          <div className="receive-management__stat-icon">
            <Package size={24} />
          </div>
          <div className="receive-management__stat-content">
            <div className="receive-management__stat-label">Tổng phiếu nhận</div>
            <div className="receive-management__stat-value">{totalReceive}</div>
          </div>
          <div className="receive-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="receive-management__stat-card receive-management__stat-card--green">
          <div className="receive-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="receive-management__stat-content">
            <div className="receive-management__stat-label">Tháng này</div>
            <div className="receive-management__stat-value">{totalThisMonth}</div>
          </div>
          <div className="receive-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Receive Tickets Section */}
      <div className="receive-management__section">
        <div className="receive-management__section-header">
          <div className="receive-management__section-title-wrapper">
            <div className="receive-management__section-title-content">
              <Package size={24} />
              <h2 className="receive-management__section-title">Danh sách phiếu nhận</h2>
            </div>
            <div className="receive-management__header-actions">
              <button className="receive-management__btn receive-management__btn--secondary" onClick={handleRefresh}>
                <RefreshCw size={20} />
                <span>Làm mới</span>
              </button>
              <button className="receive-management__btn receive-management__btn--primary" onClick={handleCreateTicket}>
                <Plus size={20} />
                <span>Tạo phiếu nhận</span>
              </button>
            </div>
          </div>
          <p className="receive-management__section-subtitle">Quản lý và theo dõi các phiếu nhận hàng</p>
        </div>

        <div className="receive-management__search-wrapper">
          <Search className="receive-management__search-icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu nhận hoặc phiếu nhập..."
            className="receive-management__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="receive-management__table-wrapper">
          <table className="receive-management__table">
            <thead>
              <tr>
                <th>MÃ PHIẾU NHẬN</th>
                <th>NGÀY NHẬN</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <span className="receive-management__code-badge">{ticket.receiveCode}</span>
                    </td>
                    <td>{ticket.receiveDate}</td>
                    <td>
                      <div className="receive-management__action-buttons">
                        <button
                          className="receive-management__action-btn receive-management__action-btn--view"
                          onClick={() => handleView(ticket.id)}
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="receive-management__action-btn receive-management__action-btn--edit"
                          onClick={() => handleEdit(ticket.id)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="receive-management__action-btn receive-management__action-btn--delete"
                          onClick={() => handleDelete(ticket)}
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
                  <td colSpan={4} className="receive-management__empty">
                    <div className="receive-management__empty-state">
                      <Package size={48} />
                      <p>Không tìm thấy phiếu nhận nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTicket && (
        <div className="receive-management__modal-overlay" onClick={handleCancelDelete}>
          <div className="receive-management__modal" onClick={(e) => e.stopPropagation()}>
            <div className="receive-management__modal-header">
              <h3>Xóa phiếu nhận</h3>
            </div>
            <div className="receive-management__modal-body">
              <p>Bạn có chắc chắn muốn xóa phiếu nhận <strong>{deleteTicket.receiveCode}</strong> không?</p>
              <p className="receive-management__modal-warning">Hành động này không thể hoàn tác.</p>
            </div>
            <div className="receive-management__modal-footer">
              <button
                className="receive-management__modal-btn receive-management__modal-btn--cancel"
                onClick={handleCancelDelete}
              >
                Hủy
              </button>
              <button
                className="receive-management__modal-btn receive-management__modal-btn--delete"
                onClick={handleConfirmDelete}
              >
                Xóa phiếu nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceiveManagement



