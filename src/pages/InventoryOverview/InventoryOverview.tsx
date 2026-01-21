import React, { useState, useMemo, useEffect } from 'react'
import { 
  Warehouse, 
  Package, 
  AlertTriangle, 
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  ClipboardCheck
} from 'lucide-react'
import { inventoryService } from '../../api/endpoints/inventoryService'
import importService from '../../api/endpoints/importService'
import { toast } from 'react-toastify'
import './InventoryOverview.css'

interface Batch {
  id: string
  batchNumber: string
  productId: string
  quantity: number
  expiryDate: string
  importDate: string
  importReceiptCode: string
  remainingQuantity: number
}

interface InventoryItem {
  id: string
  productId: string
  productCode: string
  productName: string
  category: string
  unit: string
  warehouseType: string
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
  costPrice: number
  sellingPrice: number
  lastUpdated: string
  batches: Batch[]
}

interface StockAlert {
  id: string
  productCode: string
  productName: string
  alertType: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired'
  message: string
  severity: 'warning' | 'critical'
  createdAt: string
}

const InventoryOverview = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out' | 'normal'>('all')
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts'>('overview')
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [expandedBatches] = useState<{ [key: string]: boolean }>({})
  const [showApproveCenter, setShowApproveCenter] = useState(false)
  const [receiptApprovalMap, setReceiptApprovalMap] = useState<Record<string, 'approved' | 'rejected'>>({})
  const [expandedReceipts, setExpandedReceipts] = useState<Record<string, boolean>>({})
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [pendingImports, setPendingImports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    if (showApproveCenter) {
      fetchPendingImports()
    }
  }, [showApproveCenter])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await inventoryService.getOverview()
      if (response.success && response.data) {
        // Group products by product_id and warehouse_id to aggregate batches
        const productMap = new Map<string, InventoryItem>()

        response.data.products?.forEach((item: any) => {
          const key = `${item.product_id}-${item.warehouse_id}`
          const expiryDate = item.expiry_date || null
          const importDate = item.import_date || null
          const batchCode = item.batch_code || 'N/A'
          const batchQuantity = Number(item.quantity) || 0

          if (!productMap.has(key)) {
            // Create new product entry
            productMap.set(key, {
              id: key,
              productId: item.product_id,
              productCode: item.code,
              productName: item.name,
              category: item.category || 'Khác',
              unit: item.unit,
              warehouseType: item.warehouse_name || 'Kho thường',
              currentStock: 0,
              minStockLevel: item.min_stock || 50,
              maxStockLevel: 500,
              costPrice: parseFloat(item.price || 0),
              sellingPrice: parseFloat(item.price || 0),
              lastUpdated: new Date().toLocaleString('vi-VN'),
              batches: []
            })
          }

          const product = productMap.get(key)!
          
          // Add to total stock
          product.currentStock += batchQuantity

          // Add batch if it exists
          if (expiryDate && batchCode !== 'N/A') {
            product.batches.push({
              id: batchCode,
              batchNumber: batchCode,
              productId: item.product_id,
              quantity: batchQuantity,
              expiryDate: formatDate(expiryDate),
              importDate: formatDate(importDate),
              importReceiptCode: batchCode,
              remainingQuantity: batchQuantity,
            })
          }
        })

        const transformedData = Array.from(productMap.values())

        setInventory(transformedData)
      }
    } catch (error: any) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingImports = async () => {
    try {
      // Load all imports (not just pending) to show approval status
      const response = await importService.getAll()
      if (response.success && response.data) {
        setPendingImports(response.data)
        // Initialize approval map based on current status
        const initialMap: Record<string, 'approved' | 'rejected'> = {}
        response.data.forEach((imp: any) => {
          if (imp.status === 'completed') {
            initialMap[imp.code] = 'approved'
          } else if (imp.status === 'rejected') {
            initialMap[imp.code] = 'rejected'
          }
        })
        setReceiptApprovalMap(initialMap)
      }
    } catch (error: any) {
      console.error('Error fetching pending imports:', error)
      toast.error('Không thể tải phiếu nhập chờ duyệt')
    }
  }

  const handleApproveImport = async (importId: number, receiptCode: string, approved: boolean) => {
    try {
      const response = await importService.approve(importId, approved)
      if (response.success) {
        // Update local state to show approval status without reloading
        setReceiptApprovalMap(prev => ({
          ...prev, 
          [receiptCode]: approved ? 'approved' : 'rejected'
        }))
        const statusText = approved ? 'Đã duyệt' : 'Đã từ chối'
        toast.success(`${statusText} phiếu nhập hàng thành công!`)
      } else {
        toast.error(response.message || 'Lỗi khi duyệt phiếu nhập')
      }
    } catch (error: any) {
      console.error('Error approving import:', error)
      toast.error('Lỗi khi duyệt phiếu nhập')
    }
  }

  const receiptGroups = useMemo(() => {
    // Only show pending imports in approval center, don't fallback to inventory batches
    if (showApproveCenter && pendingImports.length > 0) {
      return pendingImports.map(imp => ({
        receiptCode: imp.code,
        supplier: imp.supplier_name || 'N/A',
        createdDate: formatDate(imp.created_at),
        totalAmount: imp.total_amount,
        products: imp.products?.map((prod: any) => ({
          productName: prod.product_name,
          unit: prod.unit,
          quantity: prod.quantity,
          remainingQuantity: prod.quantity,
          costPrice: prod.price
        })) || [],
        import_id: imp.id
      }))
    }
    
    // When modal is closed, return empty array
    return []
  }, [showApproveCenter, pendingImports])

  // Tính toán thống kê
  const statistics = useMemo(() => {
    const totalProducts = inventory.length
    const lowStockCount = inventory.filter(item => 
      item.currentStock > 0 && item.currentStock <= item.minStockLevel
    ).length
    const outOfStockCount = inventory.filter(item => item.currentStock === 0).length
    const normalStockCount = inventory.filter(item => item.currentStock > item.minStockLevel).length
    const totalValue = inventory.reduce((sum, item) => 
      sum + (item.currentStock * item.costPrice), 0
    )
    const totalSellingValue = inventory.reduce((sum, item) => 
      sum + (item.currentStock * item.sellingPrice), 0
    )

    const today = new Date()
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    let expiringCount = 0
    let expiredCount = 0
    
    inventory.forEach(item => {
      if (item.batches) {
        item.batches.forEach(batch => {
          if (batch.expiryDate && batch.remainingQuantity > 0) {
            // Parse DD-MM-YYYY format
            const [day, month, year] = batch.expiryDate.split('-').map(Number)
            const expiryDate = new Date(year, month - 1, day)
            if (Number.isNaN(expiryDate.getTime())) return
            
            if (expiryDate <= today) {
              expiredCount++
            } else if (expiryDate <= thirtyDaysLater) {
              expiringCount++
            }
          }
        })
      }
    })

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount,
      normalStockCount,
      totalValue,
      totalSellingValue,
      expiringCount,
      expiredCount
    }
  }, [inventory])

  // Tạo danh sách cảnh báo
  const alerts: StockAlert[] = useMemo(() => {
    const alertList: StockAlert[] = []
    
    inventory.forEach(item => {
      if (item.currentStock === 0) {
        alertList.push({
          id: `alert-out-${item.id}`,
          productCode: item.productCode,
          productName: item.productName,
          alertType: 'out_of_stock',
          message: `Sản phẩm ${item.productName} hết hàng. Cần nhập khẩu ngay`,
          severity: 'critical',
          createdAt: new Date().toISOString()
        })
      } else if (item.currentStock <= item.minStockLevel) {
        alertList.push({
          id: `alert-low-${item.id}`,
          productCode: item.productCode,
          productName: item.productName,
          alertType: 'low_stock',
          message: `Kho ${item.productName} sắp hết. Số lượng hiện tại: ${item.currentStock}`,
          severity: 'warning',
          createdAt: new Date().toISOString()
        })
      }

      if (item.batches) {
        item.batches.forEach(batch => {
          if (batch.remainingQuantity > 0) {
            const expiryDate = new Date(batch.expiryDate)
            const today = new Date()
            const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
            
            if (expiryDate <= today) {
              alertList.push({
                id: `alert-exp-${batch.id}`,
                productCode: item.productCode,
                productName: item.productName,
                alertType: 'expired',
                message: `Lô ${batch.batchNumber} của ${item.productName} đã hết hạn (${batch.expiryDate})`,
                severity: 'critical',
                createdAt: new Date().toISOString()
              })
            } else if (expiryDate <= thirtyDaysLater) {
              alertList.push({
                id: `alert-exp-soon-${batch.id}`,
                productCode: item.productCode,
                productName: item.productName,
                alertType: 'expiring_soon',
                message: `Lô ${batch.batchNumber} của ${item.productName} sắp hết hạn (${batch.expiryDate})`,
                severity: 'warning',
                createdAt: new Date().toISOString()
              })
            }
          }
        })
      }
    })
    
    return alertList
  }, [inventory])

  // Lọc dữ liệu
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchStatus = filterStatus === 'all' ||
                         (filterStatus === 'low' && item.currentStock > 0 && item.currentStock <= item.minStockLevel) ||
                         (filterStatus === 'out' && item.currentStock === 0) ||
                         (filterStatus === 'normal' && item.currentStock > item.minStockLevel)
      
      const matchWarehouse = filterWarehouse === 'all' || item.warehouseType === filterWarehouse

      return matchSearch && matchStatus && matchWarehouse
    })
  }, [inventory, searchTerm, filterStatus, filterWarehouse])

  // Hàm xác định màu trạng thái
  const getStatusColor = (stock: number, minLevel: number) => {
    if (stock === 0) return 'critical'
    if (stock <= minLevel) return 'warning'
    return 'normal'
  }

  const openProductDetail = (product: InventoryItem) => {
    setSelectedProduct(product)
    setShowDetailModal(true)
  }

  return (
    <div className="inventory-overview-page">
      {/* Header */}
      <div className="inventory-overview__header">
        <div className="inventory-overview__header-icon">
          <Warehouse size={40} />
        </div>
        <div className="inventory-overview__header-text">
          <h1 className="inventory-overview__title">Giám sát kho hàng</h1>
          <p className="inventory-overview__subtitle">Quản lý tồn kho và cảnh báo trang thái hàng hóa</p>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="inventory-overview__stats-grid">
        <div className="inventory-overview__stat-card">
          <div className="stat-icon-wrapper stat-icon--blue">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng sản phẩm</div>
            <div className="stat-value">{statistics.totalProducts}</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card">
          <div className="stat-icon-wrapper stat-icon--green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Bình thường</div>
            <div className="stat-value">{statistics.normalStockCount}</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card">
          <div className="stat-icon-wrapper stat-icon--yellow">
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Sắp hết hàng</div>
            <div className="stat-value">{statistics.lowStockCount}</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card">
          <div className="stat-icon-wrapper stat-icon--red">
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Hết hàng</div>
            <div className="stat-value">{statistics.outOfStockCount}</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card">
          <div className="stat-icon-wrapper stat-icon--purple">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Sắp hết hạn</div>
            <div className="stat-value">{statistics.expiringCount}</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card">
          <div className="stat-icon-wrapper stat-icon--orange">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Đã hết hạn</div>
            <div className="stat-value">{statistics.expiredCount}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="inventory-overview__tabs">
        <div className="inventory-overview__tabs-left">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Tổng quan kho hàng
          </button>
          <button 
            className={`tab-button ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            Cảnh báo ({alerts.length})
          </button>
        </div>
        <div className="inventory-overview__tabs-actions">
          <button className="btn-approve-global" onClick={() => setShowApproveCenter(true)}>
            <ClipboardCheck size={18} />
            Duyệt nhập hàng
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="inventory-overview__content">
          {/* Filters */}
          <div className="inventory-overview__filters">
            <div className="filter-group search-group">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm mã hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="filter-select"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="normal">Còn hàng</option>
                <option value="low">Sắp hết hàng</option>
                <option value="out">Hết hàng</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filterWarehouse}
                onChange={(e) => setFilterWarehouse(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả kho</option>
                <option value="Kho thường">Kho thường</option>
                <option value="Kho mát">Kho mát</option>
                <option value="Kho đông lạnh">Kho đông lạnh</option>
              </select>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="inventory-overview__table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tồn</th>
                  <th>Định mức</th>
                  <th>Đơn vị</th>
                  <th>Loại kho</th>
                  <th>HSD gần nhất</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  // Lấy ngày hết hạn gần nhất (already formatted as DD-MM-YYYY)
                  const nearestExpiry = item.batches.length > 0
                    ? item.batches[0].expiryDate
                    : 'N/A'

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="inventory-row">
                        <td className="product-code">{item.productCode}</td>
                        <td className="product-name">{item.productName}</td>
                        <td className="total-stock">
                          <span className={`quantity-badge ${getStatusColor(item.currentStock, item.minStockLevel)}`}>
                            {item.currentStock}
                          </span>
                        </td>
                        <td className="threshold-stock">{item.minStockLevel}</td>
                        <td className="unit">{item.unit}</td>
                        <td className="warehouse-type">{item.warehouseType}</td>
                        <td className="expiry-date">{nearestExpiry}</td>
                        <td className="status-cell">
                          {item.currentStock === 0 && (
                            <span className="status-badge status--critical">Hết hàng</span>
                          )}
                          {item.currentStock > 0 && item.currentStock <= item.minStockLevel && (
                            <span className="status-badge status--warning">Sắp hết hàng</span>
                          )}
                          {item.currentStock > item.minStockLevel && (
                            <span className="status-badge status--normal">Còn hàng</span>
                          )}
                        </td>
                        <td className="action-cell">
                          <button 
                            className="btn-view"
                            onClick={() => openProductDetail(item)}
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>

                      {/* Batch Details */}
                      {expandedBatches[item.id] && (
                        <tr className="batch-details-row">
                          <td colSpan={9}>
                            <div className="batch-details">
                              <h4 className="batch-title">Chi tiết lô hàng:</h4>
                              {item.batches.length > 0 ? (
                                <table className="batch-details-table">
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
                                    {item.batches.map(batch => (
                                      <tr key={batch.id}>
                                        <td>{batch.batchNumber}</td>
                                        <td>{batch.importDate}</td>
                                        <td>{batch.expiryDate}</td>
                                        <td>{batch.remainingQuantity}</td>
                                        <td>
                                          <span className={`batch-status batch-status--${
                                            (() => {
                                              const today = new Date()
                                              const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
                                              if (!batch.expiryDate || batch.expiryDate === 'N/A') return 'normal'
                                              const [day, month, year] = batch.expiryDate.split('-').map(Number)
                                              if (!day || !month || !year) return 'normal'
                                              const expDate = new Date(year, month - 1, day)
                                              if (Number.isNaN(expDate.getTime())) return 'normal'
                                              
                                              // Compare dates at midnight
                                              const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                                              const expMidnight = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate())
                                              
                                              if (expMidnight <= todayMidnight) return 'expired'
                                              if (expMidnight <= thirtyDaysLater) return 'expiring'
                                              return 'normal'
                                            })()
                                          }`}>
                                            {(() => {
                                              const today = new Date()
                                              const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
                                              if (!batch.expiryDate || batch.expiryDate === 'N/A') return 'Bình thường'
                                              const [day, month, year] = batch.expiryDate.split('-').map(Number)
                                              if (!day || !month || !year) return 'Bình thường'
                                              const expDate = new Date(year, month - 1, day)
                                              if (Number.isNaN(expDate.getTime())) return 'Bình thường'
                                              
                                              // Compare dates at midnight
                                              const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                                              const expMidnight = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate())
                                              
                                              if (expMidnight <= todayMidnight) return 'Đã hết hạn'
                                              if (expMidnight <= thirtyDaysLater) return 'Sắp hết hạn'
                                              return 'Bình thường'
                                            })()}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div className="no-batch">Không có lô hàng nào</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="empty-state">
              <Package size={48} />
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Vui lòng thử lại với tiêu chí tìm kiếm khác</p>
            </div>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="inventory-overview__content">
          <div className="alerts-container">
            {alerts.length > 0 ? (
              <div className="alerts-list">
                {alerts.map(alert => (
                  <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                    <div className="alert-icon">
                      {alert.severity === 'critical' ? (
                        <AlertTriangle size={20} />
                      ) : (
                        <AlertTriangle size={20} />
                      )}
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">{alert.productCode} - {alert.productName}</div>
                      <div className="alert-message">{alert.message}</div>
                      <div className="alert-time">
                        <Clock size={14} />
                        {new Date(alert.createdAt).toLocaleTimeString('vi-VN')}
                      </div>
                    </div>
                    <div className={`alert-badge alert-badge-${alert.severity}`}>
                      {alert.alertType === 'out_of_stock' && 'Hết hàng'}
                      {alert.alertType === 'low_stock' && 'Sắp hết'}
                      {alert.alertType === 'expired' && 'Hết hạn'}
                      {alert.alertType === 'expiring_soon' && 'Sắp hết hạn'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <CheckCircle2 size={48} />
                <h3>Không có cảnh báo nào</h3>
                <p>Tất cả sản phẩm đều ở trạng thái bình thường</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedProduct && (
        <div className="inventory-overview__modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="inventory-overview__modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="inventory-overview__modal-header">
              <h2 className="inventory-overview__modal-title">Chi tiết lô - {selectedProduct.productName}</h2>
              <button 
                className="inventory-overview__modal-close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className="inventory-overview__modal-body">
              {selectedProduct.batches.length > 0 ? (
                <table className="inventory-overview__modal-batch-table">
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
                    {selectedProduct.batches.map(batch => {
                      const today = new Date()
                      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
                      
                      let batchStatus = 'Bình thường'
                      let statusClass = 'normal'
                      
                      if (batch.expiryDate && batch.expiryDate !== 'N/A') {
                        const [day, month, year] = batch.expiryDate.split('-').map(Number)
                        if (day && month && year) {
                          const expDate = new Date(year, month - 1, day)
                          if (!Number.isNaN(expDate.getTime())) {
                            const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                            const expMidnight = new Date(expDate.getFullYear(), expDate.getMonth(), expDate.getDate())
                            
                            if (expMidnight <= todayMidnight) {
                              batchStatus = 'Đã hết hạn'
                              statusClass = 'expired'
                            } else if (expMidnight <= thirtyDaysLater) {
                              batchStatus = 'Sắp hết hạn'
                              statusClass = 'expiring'
                            }
                          }
                        }
                      }
                      
                      return (
                        <tr key={batch.id}>
                          <td>
                            <span className="inventory-overview__batch-code">{batch.batchNumber}</span>
                          </td>
                          <td>{batch.importDate}</td>
                          <td>{batch.expiryDate}</td>
                          <td>
                            <span className="inventory-overview__batch-quantity">{batch.remainingQuantity}</span>
                          </td>
                          <td>
                            <span className={`inventory-overview__batch-status inventory-overview__batch-status--${statusClass}`}>
                              {batchStatus}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="inventory-overview__no-batch-modal">Không có lô hàng nào</div>
              )}
            </div>

            <div className="inventory-overview__modal-footer">
              <button 
                className="inventory-overview__modal-btn-close"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Center Modal */}
      {showApproveCenter && (
        <div className="inventory-overview__modal-overlay" onClick={() => setShowApproveCenter(false)}>
          <div className="inventory-overview__modal-content approval-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="inventory-overview__modal-header">
              <h2 className="inventory-overview__modal-title">Trung tâm duyệt nhập hàng</h2>
              <button 
                className="inventory-overview__modal-close-btn"
                onClick={() => setShowApproveCenter(false)}
              >
                ×
              </button>
            </div>
            <div className="inventory-overview__modal-body">
              {receiptGroups.length > 0 ? (
                <table className="approval-center__table">
                  <thead>
                    <tr>
                      <th style={{width: '50px'}}></th>
                      <th>MÃ PHIẾU NHẬP</th>
                      <th>NHÀ SX</th>
                      <th>NGÀY LẬP PHIẾU</th>
                      <th>GIÁ TỔNG</th>
                      <th>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptGroups.map(receipt => (
                      <React.Fragment key={receipt.receiptCode}>
                        <tr className="receipt-row">
                          <td>
                            <button 
                              className="btn-expand-receipt"
                              onClick={() => setExpandedReceipts(prev => ({...prev, [receipt.receiptCode]: !prev[receipt.receiptCode]}))}
                            >
                              {expandedReceipts[receipt.receiptCode] ? '▼' : '▶'}
                            </button>
                          </td>
                          <td>
                            <span className="receipt-code">{receipt.receiptCode}</span>
                          </td>
                          <td>{receipt.supplier}</td>
                          <td>{receipt.createdDate}</td>
                          <td>
                            <span className="receipt-total">{receipt.totalAmount.toLocaleString('vi-VN')} đ</span>
                          </td>
                          <td className="receipt-actions">
                            {receiptApprovalMap[receipt.receiptCode] ? (
                              <span className={`approval-status approval-status--${receiptApprovalMap[receipt.receiptCode]}`}>
                                {receiptApprovalMap[receipt.receiptCode] === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                              </span>
                            ) : (
                              <>
                                <button 
                                  className="inventory-overview__modal-btn-reject"
                                  onClick={() => handleApproveImport(receipt.import_id, receipt.receiptCode, false)}
                                >
                                  Từ chối
                                </button>
                                <button 
                                  className="inventory-overview__modal-btn-approve"
                                  onClick={() => handleApproveImport(receipt.import_id, receipt.receiptCode, true)}
                                >
                                  Duyệt nhập
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                        {expandedReceipts[receipt.receiptCode] && (
                          <tr className="receipt-detail-row">
                            <td colSpan={6}>
                              <div className="receipt-detail-container">
                                <table className="receipt-detail-table">
                                  <thead>
                                    <tr>
                                      <th>SẢN PHẨM</th>
                                      <th>ĐơN VỊ</th>
                                      <th>SỐ LƯỢNG</th>
                                      <th>ĐƠN GIÁ</th>
                                      <th>THÀNH TIỀN</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {receipt.products.map((prod, idx) => (
                                      <tr key={idx}>
                                        <td>{prod.productName}</td>
                                        <td>{prod.unit}</td>
                                        <td><span className="product-quantity">{prod.quantity}</span></td>
                                        <td>{prod.costPrice.toLocaleString('vi-VN')} VND</td>
                                        <td><span className="product-total">{(prod.quantity * prod.costPrice).toLocaleString('vi-VN')} VND</span></td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="inventory-overview__no-batch-modal">Không có phiếu nhập nào để duyệt</div>
              )}
            </div>
            <div className="inventory-overview__modal-footer">
              <button 
                className="inventory-overview__modal-btn-close"
                onClick={() => setShowApproveCenter(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryOverview
