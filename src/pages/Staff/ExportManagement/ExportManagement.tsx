import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Truck, Search, AlertCircle, Eye, Edit, Trash2, List } from 'lucide-react'
import { toast } from 'react-toastify';
import distributionService, { Distribution } from '../../../api/endpoints/distributionService'
import './ExportManagement.css'

const ExportManagement = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAgency, setSelectedAgency] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [inventoryLoading, setInventoryLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [distributions, setDistributions] = useState<Distribution[]>([])
  
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteExport, setDeleteExport] = useState<Distribution | null>(null);

  // Stub handlers for modal (can be implemented later)
  const handleCloseModal = () => {
    setShowRequestModal(false)
    setSelectedRequest(null)
    setInventoryData(null)
  }
  
  const handleConfirmExport = () => {
    setShowRequestModal(false)
    setSelectedRequest(null)
    setInventoryData(null)
    // TODO: Implement export creation
  }
  
  const handleCheckInventory = (id: string) => {
    // TODO: Check inventory for distribution request
    setSelectedRequest(id);
    setInventoryLoading(true);
  };

  const loadDistributions = async () => {
    try {
      setLoading(true)
      const response = await distributionService.getAll()
      if (response.success && response.data) {
        setDistributions(response.data)
      }
    } catch (error) {
      console.error('Error loading distributions:', error)
      toast.error('Không thể tải danh sách phiếu xuất')
    } finally {
      setLoading(false)
    }
  }

  // Load on mount and location change
  useEffect(() => {
    if (location.pathname === '/export-management' || location.pathname === '/staff/export-management') {
      loadDistributions()
    }
  }, [location.pathname])

  useEffect(() => {
    loadDistributions()
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      loadDistributions()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    const handleExportsUpdated = () => {
      loadDistributions()
    }
    window.addEventListener('exportsUpdated', handleExportsUpdated)
    return () => window.removeEventListener('exportsUpdated', handleExportsUpdated)
  }, [])

  const totalExports = distributions.length
  const totalAmount = distributions.reduce((sum, dist) => sum + (dist.total || 0), 0)

  const filteredExports = distributions.filter(dist => {
    const matchSearch = dist.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (dist.agency_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchAgency = selectedAgency === 'all' || dist.agency_name === selectedAgency
    return matchSearch && matchAgency
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleView = (id: number) => {
    navigate(`/staff/view-export/${id}`);
  }

  const handleEdit = (id: number) => {
    navigate(`/staff/edit-export/${id}`)
  }

  const handleDelete = (id: number) => {
    const dist = distributions.find(d => d.id === id);
    if (!dist) return;
    setDeleteExport(dist);
    setShowDeleteModal(true);
  }

  const handleConfirmDelete = async () => {
    if (deleteExport) {
      try {
        const response = await distributionService.cancel(deleteExport.id, 'Xóa bởi nhân viên')
        if (response.success) {
          toast.success('Đã hủy phiếu xuất ' + deleteExport.code + ' thành công!');
          loadDistributions()
        }
      } catch (error) {
        console.error('Error canceling distribution:', error)
        toast.error('Không thể hủy phiếu xuất')
      }
    }
    setShowDeleteModal(false);
    setDeleteExport(null);
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteExport(null);
  }

  const handleConfirmFeedback = () => {
    setShowRequestModal(true);
  }

  const handlePauseRequest = () => {
    setSelectedRequest(null)
    setInventoryData(null)
    alert('Yêu cầu đã được tạm hoãn')
  }

  return (
    <div className="export-management-page">
      {/* Header Section */}
      <div className="export-header">
        <div className="export-management__header-icon">
          <Truck size={36} />
        </div>
        <div className="export-management__header-text">
          <h1 className="export-title">QUẢN LÝ XUẤT HÀNG</h1>
          <p className="export-subtitle">Theo dõi và quản lý các phiếu xuất hàng của đại lý.</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="export-stats-grid">
        <div className="export-stat-card stat-blue">
          <div className="stat-icon-box">
            <List size={32} />
          </div>
          <div className="export-management__stat-content">
            <div className="export-management__stat-label">Tổng phiếu xuất</div>
            <div className="export-management__stat-value">{totalExports}</div>
          </div>
        </div>
        <div className="export-stat-card stat-green">
          <div className="stat-icon-box">
            <span className="currency-icon">₫</span>
          </div>
          <div className="export-management__stat-content">
            <div className="export-management__stat-label">Tổng số tiền</div>
            <div className="export-management__stat-value">{(totalAmount / 1000000).toFixed(2)}M</div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="export-main-card">
        <div className="export-main-header">
          <div className="main-header-left">
            <Truck size={28} />
            <h2 className="main-title">QUẢN LÝ XUẤT HÀNG</h2>
          </div>
          <div className="main-header-actions">
            <button className="export-management__action-btn export-management__action-btn--orange" onClick={handleConfirmFeedback}>
              <AlertCircle size={20} />
              <span>Xác nhận yêu cầu phân phối</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="export-filters">
          <div className="filter-search">
            <Search className="export-management__search-icon" size={20} />
            <input
              type="text"
              className="export-management__search-input"
              placeholder="Tìm kiếm phiếu xuất..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="export-management__filter-select"
            value={selectedAgency}
            onChange={(e) => setSelectedAgency(e.target.value)}
          >
            <option value="all">Tất cả đại lý</option>
            <option value="Đại lý Đại">Đại lý Đại</option>
            <option value="Đại lý Nghĩa">Đại lý Nghĩa</option>
          </select>
          <input
            type="date"
            className="export-management__filter-date"
            placeholder="mm/dd/yyyy"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="export-management__filter-date"
            placeholder="mm/dd/yyyy"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="export-table-section">
          <div className="table-header">
            <List size={24} />
            <h3 className="table-title">Danh sách phiếu xuất</h3>
          </div>

          <div className="export-table-wrapper">
            <table className="export-table">
              <thead>
                <tr>
                  <th className="col-code">MÃ PHIẾU XUẤT</th>
                  <th className="col-agency">ĐẠI LÝ</th>
                  <th className="col-date">NGÀY LẬP PHIẾU</th>
                  <th className="col-total">TỔNG TIỀN</th>
                  <th className="col-status">TRẠNG THÁI</th>
                  <th className="col-actions">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredExports.length > 0 ? (
                  filteredExports.map((dist) => (
                    <tr key={dist.id}>
                      <td className="col-code">
                        <div className="export-code">
                          <Truck size={18} />
                          <span>{dist.code}</span>
                        </div>
                      </td>
                      <td className="col-agency">{dist.agency_name || dist.agency_code}</td>
                      <td className="col-date">{new Date(dist.created_at).toLocaleDateString('vi-VN')}</td>
                      <td className="col-total">
                        <span className="export-total-amount">{formatCurrency(dist.total)}</span>
                      </td>
                      <td className="col-status">
                        <span className={`status-badge status-${dist.status}`}>
                          {dist.status === 'pending' && 'Chờ duyệt'}
                          {dist.status === 'approved' && 'Đã duyệt'}
                          {dist.status === 'delivered' && 'Đã giao'}
                          {dist.status === 'cancelled' && 'Đã hủy'}
                        </span>
                      </td>
                      <td className="col-actions">
                        <div className="export-management__action-buttons">
                          <button
                            className="export-management__action-icon-btn export-management__action-icon-btn--view"
                            onClick={() => handleView(dist.id)}
                            title="Xem"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="export-management__action-icon-btn export-management__action-icon-btn--edit"
                            onClick={() => handleEdit(dist.id)}
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="export-management__action-icon-btn export-management__action-icon-btn--delete"
                            onClick={() => handleDelete(dist.id)}
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
                    <td colSpan={6} className="export-management__no-data">
                      <Truck size={48} />
                      <p>Không tìm thấy phiếu xuất nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popup xác nhận xóa phiếu xuất */}
      {showDeleteModal && deleteExport && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content modal-delete-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-delete-modern-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="modal-delete-modern-title">Xác nhận xóa phiếu xuất</div>
            <div className="modal-delete-modern-desc">
              Bạn có chắc chắn muốn xóa phiếu xuất <b>{deleteExport.code}</b>?
            </div>
            <div className="modal-delete-modern-warning">Hành động này không thể hoàn tác.</div>
            <div className="modal-delete-modern-actions">
              <button className="btn-modal-cancel-modern" onClick={handleCancelDelete}>Hủy bỏ</button>
              <button className="btn-modal-delete-modern" onClick={handleConfirmDelete}>Xóa phiếu xuất</button>
            </div>
          </div>
        </div>
      )}

      {/* Distribution Request Modal - TODO: Implement with real data */}
      {/* Commented out until real data available */}
    </div>
  )
}

export default ExportManagement



