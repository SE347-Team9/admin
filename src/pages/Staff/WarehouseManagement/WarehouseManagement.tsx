import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Eye, Trash2, Edit, AlertTriangle } from 'lucide-react'
import { toast } from 'react-toastify'
import { inventoryService } from '../../../api/endpoints/inventoryService'
import './WarehouseManagement.css'

interface ProductBatch {
  id: string
  batchCode: string
  mfgDate: string
  expDate: string
  quantity: number
  remainingQuantity: number
  status: string
  statusKey?: 'normal' | 'expiring' | 'expired' | 'out'
  statusLabel?: string
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

  // Format date as DD-MM-YYYY
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A'
    const d = new Date(dateStr)
    if (Number.isNaN(d.getTime())) return 'N/A'
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dd}-${mm}-${yyyy}`
  }

  const getBatchStatus = (expiryDate: string | null | undefined, quantity: number) => {
    const today = new Date()
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

    if (!expiryDate) return { statusKey: 'normal' as const, statusLabel: 'Bình thường' }

    // Parse ISO date from database (YYYY-MM-DD)
    const exp = new Date(expiryDate)
    if (Number.isNaN(exp.getTime())) return { statusKey: 'normal' as const, statusLabel: 'Bình thường' }

    if (quantity <= 0) return { statusKey: 'out' as const, statusLabel: 'Hết hàng' }
    
    // Compare dates at midnight to avoid time issues
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const expMidnight = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate())
    
    if (expMidnight <= todayMidnight) return { statusKey: 'expired' as const, statusLabel: 'Đã hết hạn' }
    if (expMidnight <= thirtyDaysLater) return { statusKey: 'expiring' as const, statusLabel: 'Sắp hết hạn' }
    return { statusKey: 'normal' as const, statusLabel: 'Bình thường' }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await inventoryService.getOverview()
      if (response.success && response.data) {
        // Group products by product_id and warehouse_id to aggregate batches
        const productMap = new Map<string, Product>()

        response.data.products?.forEach((item: any) => {
          const key = `${item.product_id}-${item.warehouse_id}`
          const batchCode = item.batch_code || 'N/A'
          const batchQuantity = Number(item.quantity) || 0

          if (!productMap.has(key)) {
            // Create new product entry
            productMap.set(key, {
              id: key,
              code: item.code,
              name: item.name,
              totalQuantity: 0,
              threshold: item.min_stock || 50,
              unit: item.unit,
              warehouseType: item.warehouse_name || 'Kho thường',
              status: 'normal',
              batches: []
            })
          }

          const product = productMap.get(key)!
          
          // Add to total stock
          product.totalQuantity += batchQuantity

          // Add batch if it exists
          if (item.expiry_date && batchCode !== 'N/A') {
            const { statusKey, statusLabel } = getBatchStatus(item.expiry_date, batchQuantity)
            product.batches.push({
              id: batchCode,
              batchCode: batchCode,
              mfgDate: formatDate(item.import_date),
              expDate: formatDate(item.expiry_date),
              quantity: batchQuantity,
              remainingQuantity: batchQuantity,
              status: statusLabel,
              statusKey,
              statusLabel
            })
          }
        })

        // Convert map to array and set status based on quantity
        const transformedData = Array.from(productMap.values()).map(product => ({
          ...product,
          status: product.totalQuantity === 0 ? 'out' as const : 
                  product.totalQuantity <= product.threshold ? 'low' as const : 
                  'normal' as const
        }))

        setProducts(transformedData)
      }
    } catch (error: any) {
      console.error('Error fetching inventory:', error)
      toast.error('Không thể tải dữ liệu kho')
    }
  }

  const statistics = useMemo(() => {
    const totalProducts = products.length
    const normalCount = products.filter(p => p.totalQuantity > p.threshold).length
    const lowStockCount = products.filter(p => p.totalQuantity > 0 && p.totalQuantity <= p.threshold).length
    const outOfStockCount = products.filter(p => p.totalQuantity === 0).length

    const today = new Date()
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    let expiringCount = 0
    let expiredCount = 0

    products.forEach(product => {
      product.batches.forEach(batch => {
        if (batch.expDate && batch.expDate !== 'N/A' && batch.remainingQuantity > 0) {
          const [day, month, year] = batch.expDate.split('-').map(Number)
          if (!day || !month || !year) return
          const expiryDate = new Date(year, month - 1, day)
          if (Number.isNaN(expiryDate.getTime())) return
          
          if (expiryDate <= today) {
            expiredCount++
          } else if (expiryDate <= thirtyDaysLater) {
            expiringCount++
          }
        }
      })
    })

    return {
      totalProducts,
      normalCount,
      lowStockCount,
      outOfStockCount,
      expiringCount,
      expiredCount
    }
  }, [products])

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
    if (batches.length === 0) return { date: null, daysRemaining: 0, dateString: 'N/A' }

    const today = new Date()
    const batchesWithDays = batches
      .filter(batch => batch.expDate && batch.expDate !== 'N/A')
      .map(batch => {
        // Parse date in DD-MM-YYYY format
        const [day, month, year] = batch.expDate.split('-').map(Number)
        const expDate = new Date(year, month - 1, day)
        const daysRemaining = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return { batch, expDate, daysRemaining }
      })

    if (batchesWithDays.length === 0) return { date: null, daysRemaining: 0, dateString: 'N/A' }

    // Sort by days remaining (ascending)
    const nearest = batchesWithDays.sort((a, b) => a.daysRemaining - b.daysRemaining)[0]

    return {
      date: nearest.expDate,
      daysRemaining: nearest.daysRemaining,
      dateString: nearest.batch.expDate
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

      {/* Statistics Cards - align with Admin overview */}
      <div className="warehouse-management__stats-grid">
        <div className="warehouse-management__stat-card warehouse-management__stat-card--blue">
          <div className="warehouse-management__stat-icon">
            <Package size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Tổng sản phẩm</div>
            <div className="warehouse-management__stat-value">{statistics.totalProducts}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--green">
          <div className="warehouse-management__stat-icon">
            <Package size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Bình thường</div>
            <div className="warehouse-management__stat-value">{statistics.normalCount}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--orange">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Sắp hết hàng</div>
            <div className="warehouse-management__stat-value">{statistics.lowStockCount}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--red">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Hết hàng</div>
            <div className="warehouse-management__stat-value">{statistics.outOfStockCount}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--purple">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Sắp hết hạn</div>
            <div className="warehouse-management__stat-value">{statistics.expiringCount}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
          </div>
        </div>

        <div className="warehouse-management__stat-card warehouse-management__stat-card--grey">
          <div className="warehouse-management__stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="warehouse-management__stat-content">
            <div className="warehouse-management__stat-label">Đã hết hạn</div>
            <div className="warehouse-management__stat-value">{statistics.expiredCount}</div>
            <div className="warehouse-management__stat-unit">sản phẩm</div>
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
                      {(() => {
                        const expInfo = getNearestExpDate(product.batches)
                        if (expInfo.dateString === 'N/A') return 'N/A'
                        return expInfo.dateString
                      })()}
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
                    <th>SỐ LƯỢNG</th>
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
                        <span className="warehouse-management__batch-quantity">{batch.remainingQuantity.toLocaleString('vi-VN')}</span>
                      </td>
                      <td>
                        <span className={`warehouse-management__batch-status warehouse-management__batch-status--${(batch.statusKey || 'normal') === 'expiring' ? 'sắp-hết-hạn' : (batch.statusKey === 'expired' ? 'đã-hết-hạn' : 'bình-thường')}`}>
                          {batch.statusLabel || batch.status}
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



