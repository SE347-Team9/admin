import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, RefreshCw, Plus, Search, Eye, Edit, Trash2, TrendingUp, TrendingDown, AlertTriangle, Activity } from 'lucide-react'
import { toast } from 'react-toastify'
import importService from '../../../api/endpoints/importService'
import inventoryService from '../../../api/endpoints/inventoryService'
import './ReceiveGoods.css'

interface Receipt {
  id: string
  code: string
  supplier: string
  date: string
  total: number
  status: 'pending' | 'approved' | 'rejected'
}

const ReceiveGoods = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReceipts: 0,
    totalValue: 0,
    monthCount: 0,
    monthValue: 0
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [importsResponse, inventoryResponse] = await Promise.all([
        importService.getAll(),
        inventoryService.getAll()
      ])
      
      if (importsResponse.success && importsResponse.data) {
        const receiptData = importsResponse.data.map(imp => ({
          id: imp.id.toString(),
          code: imp.code,
          supplier: imp.agency_name || 'N/A',
          date: new Date(imp.created_at).toLocaleDateString('vi-VN'),
          total: imp.total_amount,
          status: imp.status as 'pending' | 'approved' | 'rejected'
        }))
        setReceipts(receiptData)

        // Calculate statistics
        const totalReceipts = importsResponse.data.length
        const totalValue = importsResponse.data.reduce((sum: number, imp: any) => sum + (Number(imp.total_amount) || 0), 0)
        const now = new Date()
        const monthCount = importsResponse.data.filter((imp: any) => {
          const created = new Date(imp.created_at)
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        }).length
        const monthValue = importsResponse.data.reduce((sum: number, imp: any) => {
          const created = new Date(imp.created_at)
          if (created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()) {
            return sum + (Number(imp.total_amount) || 0)
          }
          return sum
        }, 0)

        setStats({ totalReceipts, totalValue, monthCount, monthValue })
      }
      
      if (inventoryResponse.success && inventoryResponse.data) {
        setInventoryItems(inventoryResponse.data)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  };
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReceipt, setDeleteReceipt] = useState<Receipt | null>(null);

  const filteredReceipts = receipts.filter(receipt =>
    receipt.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleView = (id: string) => {
    navigate(`/import/view/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/import/edit/${id}`)
  }

  const handleDelete = (id: string) => {
    const receipt = receipts.find(r => r.id === id) || null;
    setDeleteReceipt(receipt);
    setShowDeleteModal(true);
  }

  const handleConfirmDelete = () => {
    if (deleteReceipt) {
      setReceipts(prev => prev.filter(r => r.id !== deleteReceipt.id));
      toast.success('Đã xóa phiếu nhập thành công!');
    }
    setShowDeleteModal(false);
    setDeleteReceipt(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteReceipt(null);
  };

  const handleCreateReceipt = () => {
    navigate('/staff/create-receipt')
  }

  const handleRefresh = () => {
    console.log('Refresh data')
  }

  const handleViewInventory = () => {
    setShowInventoryModal(true)
  }

  const handleCloseInventoryModal = () => {
    setShowInventoryModal(false)
  }

  const handleRefreshInventory = () => {
    console.log('Refresh inventory')
    // TODO: Call API to refresh inventory data
  }

  const handleViewReport = () => {
    navigate('/staff/reports')
  }

  const getQuantityClass = (quantity: number) => {
    if (quantity < 100) return 'quantity-low'
    if (quantity < 200) return 'quantity-medium'
    return 'quantity-high'
  }

  return (
    <div className="receive-goods-page">
      {/* Header Section */}
      <div className="receive-goods__header">
        <div className="receive-goods__header-icon">
          <Package size={36} />
        </div>
        <div className="receive-goods__header-text">
          <h1 className="receive-goods__title">Quản lý Nhập hàng</h1>
          <p className="receive-goods__subtitle">Dashboard tổng quan và quản lý phiếu nhập</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="receive-goods__stats-grid">
        <div className="receive-goods__stat-card receive-goods__stat-card--blue">
          <div className="receive-goods__stat-icon">
            <Package size={24} />
          </div>
          <div className="receive-goods__stat-content">
            <div className="receive-goods__stat-label">Tổng phiếu nhập</div>
            <div className="receive-goods__stat-value">{stats.totalReceipts}</div>
            <div className="receive-goods__stat-note">Tất cả thời gian</div>
          </div>
          <div className="receive-goods__stat-badge receive-goods__stat-badge--up">
            <TrendingUp size={16} />
            <span>+12%</span>
          </div>
        </div>

        <div className="receive-goods__stat-card receive-goods__stat-card--green">
          <div className="receive-goods__stat-icon">
            <span className="receive-goods__currency-icon">₫</span>
          </div>
          <div className="receive-goods__stat-content">
            <div className="receive-goods__stat-label">Tổng giá trị</div>
            <div className="receive-goods__stat-value">{(stats.totalValue / 1000000).toFixed(1)}M</div>
            <div className="receive-goods__stat-note">{formatCurrency(stats.totalValue)}</div>
          </div>
          <div className="receive-goods__stat-badge receive-goods__stat-badge--up">
            <TrendingUp size={16} />
            <span>+8%</span>
          </div>
        </div>

        <div className="receive-goods__stat-card receive-goods__stat-card--purple">
          <div className="receive-goods__stat-icon">
            <Activity size={24} />
          </div>
          <div className="receive-goods__stat-content">
            <div className="receive-goods__stat-label">Tháng này</div>
            <div className="receive-goods__stat-value">{stats.monthCount}</div>
            <div className="receive-goods__stat-note">{(stats.monthValue / 1000000).toFixed(1)}M VND</div>
          </div>
          <div className="receive-goods__stat-badge receive-goods__stat-badge--up">
            <TrendingUp size={16} />
            <span>+15%</span>
          </div>
        </div>
      </div>

      {/* Recent Receipts Section */}
      <div className="receive-goods__recent-section">
        <div className="receive-goods__section-header">
          <div className="receive-goods__section-title-wrapper">
            <div>
              <Package size={24} />
              <h2 className="receive-goods__section-title">Phiếu nhập gần đây</h2>
            </div>
            <div className="receive-goods__header-actions">
              <button className="receive-goods__header-btn receive-goods__header-btn--primary" onClick={handleCreateReceipt}>
                <Plus size={20} />
                <span>Lập mới</span>
              </button>
              <button className="receive-goods__header-btn receive-goods__header-btn--secondary" onClick={handleRefresh}>
                <RefreshCw size={20} />
                <span>Làm mới</span>
              </button>
            </div>
          </div>
          <p className="receive-goods__section-subtitle">Quản lý và theo dõi các phiếu nhập</p>
        </div>

        <div className="receive-goods__search-wrapper">
          <Search className="receive-goods__search-icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm phiếu nhập..."
            className="receive-goods__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="receive-goods__table-wrapper">
          <table className="receive-goods__table">
            <thead>
              <tr>
                <th>MÃ PHIẾU NHẬP</th>
                <th>NHÀ SX</th>
                <th>NGÀY LẬP PHIẾU</th>
                <th>GIÁ TỔNG</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredReceipts.length > 0 ? (
                filteredReceipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td>
                      <span className="receive-goods__receipt-code">{receipt.code}</span>
                    </td>
                    <td>{receipt.supplier}</td>
                    <td>{receipt.date}</td>
                    <td>
                      <span className="receive-goods__receipt-total">
                        {formatCurrency(receipt.total)}
                      </span>
                    </td>
                    <td>
                      <span className={`receive-goods__status-badge receive-goods__status-${receipt.status}`}>
                        {receipt.status === 'pending' && 'Chờ duyệt'}
                        {receipt.status === 'approved' && 'Đã duyệt'}
                        {receipt.status === 'rejected' && 'Không duyệt'}
                      </span>
                    </td>
                    <td>
                      <div className="receive-goods__action-buttons">
                        <button
                          className="receive-goods__action-btn receive-goods__action-btn--view"
                          onClick={() => handleView(receipt.id)}
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="receive-goods__action-btn receive-goods__action-btn--edit"
                          onClick={() => handleEdit(receipt.id)}
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="receive-goods__action-btn receive-goods__action-btn--delete"
                          onClick={() => handleDelete(receipt.id)}
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
                  <td colSpan={4} className="receive-goods__no-data">
                    <Package size={48} />
                    <p>Không tìm thấy phiếu nhập nào</p>
                  </td>
                </tr>
              )}
      {/* Popup xác nhận xóa phiếu nhập */}
      {showDeleteModal && deleteReceipt && (
        <div className="receive-goods__modal-overlay" onClick={handleCancelDelete}>
          <div className="receive-goods__modal-delete" onClick={e => e.stopPropagation()}>
            <div className="receive-goods__modal-delete-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="receive-goods__modal-delete-title">Xác nhận xóa phiếu nhập?</div>
            <div className="receive-goods__modal-delete-desc">Bạn có chắc chắn muốn xóa phiếu nhập <b>{deleteReceipt.code}</b> không?</div>
            <div className="receive-goods__modal-delete-warning">Hành động này không thể hoàn tác!</div>
            <div className="receive-goods__modal-delete-actions">
              <button className="receive-goods__modal-delete-cancel" onClick={handleCancelDelete}>Hủy</button>
              <button className="receive-goods__modal-delete-confirm" onClick={handleConfirmDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="inventory-modal-overlay" onClick={handleCloseInventoryModal}>
          <div className="inventory-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="inventory-modal-header">
              <div className="inventory-modal-header-left">
                <div className="inventory-modal-icon">
                  <Package size={28} />
                </div>
                <h2 className="inventory-modal-title">Tồn kho hiện tại</h2>
              </div>
              <button className="inventory-modal-close" onClick={handleCloseInventoryModal}>
                ×
              </button>
            </div>
            
            <p className="inventory-modal-description">
              Danh sách sản phẩm và số lượng tồn kho
            </p>

            <div className="inventory-table-container">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Mặt hàng</th>
                    <th>Đơn vị</th>
                    <th>Tồn kho</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="inventory-stt">{index + 1}</td>
                      <td className="inventory-name">{item.name}</td>
                      <td className="inventory-unit">{item.unit}</td>
                      <td>
                        <span className={`inventory-quantity ${getQuantityClass(item.quantity)}`}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="inventory-price">
                        {item.price.toLocaleString('vi-VN')} VND
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="inventory-modal-footer">
              <div className="inventory-summary">
                <span className="inventory-summary-label">
                  {inventoryItems.length} sản phẩm
                </span>
              </div>
              <div className="inventory-modal-actions">
                <button className="btn-inventory-refresh" onClick={handleRefreshInventory}>
                  <RefreshCw size={18} />
                  <span>Làm mới</span>
                </button>
                <button className="btn-inventory-close" onClick={handleCloseInventoryModal}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReceiveGoods



