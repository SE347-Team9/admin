import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Eye, Trash2, Edit, AlertTriangle, TrendingUp } from 'lucide-react'
import { toast } from 'react-toastify'
import { inventoryService } from '../../../api/endpoints/inventoryService'
import './WarehouseManagement.css'

interface ProductBatch {
  id: string
  batchCode: string
  mfgDate: string
  expDate: string
  quantity: number
  status: string
}

interface Product {
  id: string
  code: string
  name: string
  totalQuantity: number
  threshold: number
  unit: string
  warehouseType: string
  status: 'normal' | 'low' | 'out' | 'expired'
  batches: ProductBatch[]
}

const WarehouseManagement = () => {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await inventoryService.getOverview()
      if (response.success && response.data) {
        const transformed = response.data.products?.map((item: any) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          totalQuantity: item.quantity || 0,
          threshold: 100,
          unit: item.unit,
          warehouseType: 'Kho thường',
          status: (item.quantity || 0) === 0 ? 'out' as const : (item.quantity || 0) < 100 ? 'low' as const : 'normal' as const,
          batches: []
        })) || []
        setProducts(transformed)
      }
    } catch (error: any) {
      console.error('Error fetching inventory:', error)
      toast.error('Không thể tải dữ liệu kho')
    } finally {
      setLoading(false)
    }
  }

  const totalProducts = products.length
  const totalQuantity = products.reduce((sum, p) => sum + p.totalQuantity, 0)
  const outOfStockProducts = products.filter(p => p.status === 'out').length
  const lowStockProducts = products.filter(p => p.status === 'low').length
  const expiredProducts = products.filter(p => p.status === 'expired').length

  // Filter products based on search, warehouse and status
  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchWarehouse = filterWarehouse === 'all' || product.warehouseType === filterWarehouse
    const matchStatus = filterStatus === 'all' || product.status === filterStatus
    const excludeExpired = product.status !== 'expired'
    return matchSearch && matchWarehouse && matchStatus && excludeExpired
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'normal'
      case 'low':
        return 'low'
      case 'out':
        return 'out'
      case 'expired':
        return 'expired'
      default:
        return 'normal'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Còn hàng'
      case 'low':
        return 'Sắp hết hàng'
      case 'out':
        return 'Hết hàng'
      case 'expired':
        return 'Sắp hết hạn'
      default:
        return 'Bình thường'
    }
  }

  const getNearestExpDate = (batches: ProductBatch[]) => {
    if (batches.length === 0) return { date: '', daysRemaining: 0, dateString: '' }

    const today = new Date()
    const batchesWithDays = batches.map(batch => {
      // Parse date in DD/MM/YYYY format
      const [day, month, year] = batch.expDate.split('/').map(Number)
      const expDate = new Date(year, month - 1, day)
      const daysRemaining = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { ...batch, expDate, daysRemaining }
    })

    // Sort by days remaining (ascending)
    const nearest = batchesWithDays.sort((a, b) => a.daysRemaining - b.daysRemaining)[0]

    return {
      date: nearest.expDate,
      daysRemaining: nearest.daysRemaining,
      dateString: nearest.expDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
  }

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setShowBatchModal(true)
  }

  const handleDelete = (product: Product) => {
    setDeleteProduct(product)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteProduct) {
      toast.success(`Đã xóa sản phẩm ${deleteProduct.name}`)
    }
    setShowDeleteModal(false)
    setDeleteProduct(null)
  }

  const handleEdit = (product: Product) => {
    navigate(`/warehouse-management/edit/${product.id}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="warehouse-management-page">
      {/* Header Section */}
      <div className="warehouse-management__header">
        <div className="warehouse-management__header-icon">
          <Package size={36} />
        </div>
        <div className="warehouse-management__header-text">
          <h1 className="warehouse-management__title">Quản lý Kho</h1>
          <p className="warehouse-management__subtitle">Theo dõi tồn kho và quản lý sản phẩm trong kho</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="warehouse-management__stats-grid">
        <div className="warehouse-management__stat-card warehouse-management__stat-card--blue">
          <div className="warehouse-management__stat-icon">
            <Package size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Tổng tồn kho</div>
            <div className="warehouse-management__stat-value">{totalQuantity.toLocaleString('vi-VN')}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
          <div className="warehouse-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--red">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Hàng đã hết</div>
            <div className="warehouse-management__stat-value">{outOfStockProducts}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
          <div className="warehouse-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--orange">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Hàng sắp hết</div>
            <div className="warehouse-management__stat-value">{lowStockProducts}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
          <div className="warehouse-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--purple">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Hàng sắp hết hạn</div>
            <div className="warehouse-management__stat-value">{expiredProducts}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
          <div className="warehouse-management__stat-badge">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Products Table Section */}
      <div className="warehouse-management__section">
        <div className="warehouse-management__section-header">
          <div className="warehouse-management__section-title-wrapper">
            <Package size={24} />
            <h2 className="warehouse-management__section-title">Danh sách sản phẩm</h2>
          </div>
          <p className="warehouse-management__section-subtitle">Quản lý và theo dõi tồn kho sản phẩm</p>
        </div>

        {/* Filter Controls */}
        <div className="warehouse-management__filters">
          <div className="warehouse-management__search-box">
            <input
              type="text"
              className="warehouse-management__search-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="warehouse-management__filter-group">
            <select
              className="warehouse-management__filter-select"
              value={filterWarehouse}
              onChange={(e) => setFilterWarehouse(e.target.value)}
            >
              <option value="all">Tất cả loại kho</option>
              <option value="Kho thường">Kho thường</option>
              <option value="Kho mát">Kho mát</option>
              <option value="Kho đông lạnh">Kho đông lạnh</option>
            </select>
            <select
              className="warehouse-management__filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="normal">Bình thường</option>
              <option value="low">Sắp hết hàng</option>
              <option value="out">Hết hàng</option>
            </select>
          </div>
        </div>

        <div className="warehouse-management__table-wrapper">
          <table className="warehouse-management__table">
            <thead>
              <tr>
                                <th>MÃ SP</th>
                <th>SẢN PHẨM</th>
                <th>TỔNG TỒN</th>
                <th>ĐỊNH MỨC</th>
                <th>ĐƠN VỊ</th>
                <th>LOẠI KHO</th>
                                <th>HSD GẦN NHẤT</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                                    <td>
                                      <span className="warehouse-management__product-code">{product.code}</span>
                                    </td>
                  <td>
                    <span className="warehouse-management__product-name">{product.name}</span>
                  </td>
                  <td>
                    <span className="warehouse-management__quantity">{product.totalQuantity.toLocaleString('vi-VN')}</span>
                  </td>
                  <td>
                    <span className="warehouse-management__threshold">{product.threshold.toLocaleString('vi-VN')}</span>
                  </td>
                  <td>{product.unit}</td>
                  <td>{product.warehouseType}</td>
                                    <td>
                                      <span className="warehouse-management__exp-date">
                                        {getNearestExpDate(product.batches).dateString && (
                                          <>
                                            {getNearestExpDate(product.batches).dateString}
                                            <br />
                                            <small>({getNearestExpDate(product.batches).daysRemaining} ngày)</small>
                                          </>
                                        )}
                                      </span>
                                    </td>
                  <td>
                    <span className={`warehouse-management__status warehouse-management__status--${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                  </td>
                  <td>
                    <div className="warehouse-management__action-buttons">
                      <button
                        className="warehouse-management__action-btn warehouse-management__action-btn--view"
                        onClick={() => handleView(product)}
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="warehouse-management__action-btn warehouse-management__action-btn--edit"
                        onClick={() => handleEdit(product)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="warehouse-management__action-btn warehouse-management__action-btn--delete"
                        onClick={() => handleDelete(product)}
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Details Modal */}
      {showBatchModal && selectedProduct && (
        <div className="warehouse-management__modal-overlay" onClick={() => setShowBatchModal(false)}>
          <div className="warehouse-management__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="warehouse-management__modal-header">
              <h2 className="warehouse-management__modal-title">Chi tiết lô - {selectedProduct.name}</h2>
              <button 
                className="warehouse-management__modal-close"
                onClick={() => setShowBatchModal(false)}
              >
                ×
              </button>
            </div>

            <div className="warehouse-management__modal-body">
              <table className="warehouse-management__batch-table">
                <thead>
                  <tr>
                    <th>MÃ LÔ</th>
                    <th>NGÀY SX</th>
                    <th>HSD</th>
                    <th>SL</th>
                    <th>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProduct.batches.map((batch) => (
                    <tr key={batch.id}>
                      <td>
                        <span className="warehouse-management__batch-code">{batch.batchCode}</span>
                      </td>
                      <td>{batch.mfgDate}</td>
                      <td>{batch.expDate}</td>
                      <td>
                        <span className="warehouse-management__batch-quantity">{batch.quantity.toLocaleString('vi-VN')}</span>
                      </td>
                      <td>
                        <span className={`warehouse-management__batch-status warehouse-management__batch-status--${batch.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {batch.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="warehouse-management__modal-footer">
              <button 
                className="warehouse-management__modal-btn warehouse-management__modal-btn--close"
                onClick={() => setShowBatchModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteProduct && (
        <div className="warehouse-management__modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="warehouse-management__modal-delete" onClick={(e) => e.stopPropagation()}>
            <div className="warehouse-management__modal-delete-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="warehouse-management__modal-delete-title">Xác nhận xóa sản phẩm?</div>
            <div className="warehouse-management__modal-delete-desc">
              Bạn có chắc chắn muốn xóa sản phẩm <b>{deleteProduct.name}</b> không?
            </div>
            <div className="warehouse-management__modal-delete-warning">Hành động này không thể hoàn tác!</div>
            <div className="warehouse-management__modal-delete-actions">
              <button 
                className="warehouse-management__modal-delete-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button 
                className="warehouse-management__modal-delete-confirm"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WarehouseManagement



