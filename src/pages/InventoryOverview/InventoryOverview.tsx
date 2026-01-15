import { useState, useMemo } from 'react'
import { 
  Warehouse, 
  Package, 
  AlertTriangle, 
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Eye,
  X,
  DollarSign
} from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts'>('overview')
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Mock inventory data - Dữ liệu này sẽ được lấy từ API (cùng nguồn với Staff)
  const [inventory] = useState<InventoryItem[]>([
    {
      id: '1',
      productId: 'SP001',
      productCode: 'SP001',
      productName: 'Bia Hà Nội',
      category: 'Đồ uống có cồn',
      unit: 'Thùng',
      currentStock: 150,
      minStockLevel: 50,
      maxStockLevel: 500,
      costPrice: 200000,
      sellingPrice: 250000,
      lastUpdated: '2026-01-14 10:30',
      batches: [
        { id: 'B001', batchNumber: 'LOT2025001', productId: 'SP001', quantity: 100, expiryDate: '2026-06-15', importDate: '2025-12-01', importReceiptCode: 'PN001', remainingQuantity: 80 },
        { id: 'B002', batchNumber: 'LOT2025002', productId: 'SP001', quantity: 100, expiryDate: '2026-08-20', importDate: '2026-01-05', importReceiptCode: 'PN002', remainingQuantity: 70 }
      ]
    },
    {
      id: '2',
      productId: 'SP002',
      productCode: 'SP002',
      productName: 'Nước ngọt Pepsi',
      category: 'Nước giải khát',
      unit: 'Thùng',
      currentStock: 25,
      minStockLevel: 30,
      maxStockLevel: 300,
      costPrice: 150000,
      sellingPrice: 180000,
      lastUpdated: '2026-01-14 09:15',
      batches: [
        { id: 'B003', batchNumber: 'LOT2025003', productId: 'SP002', quantity: 50, expiryDate: '2026-02-10', importDate: '2025-11-10', importReceiptCode: 'PN001', remainingQuantity: 25 }
      ]
    },
    {
      id: '3',
      productId: 'SP003',
      productCode: 'SP003',
      productName: 'Sữa Vinamilk',
      category: 'Sữa & Sản phẩm từ sữa',
      unit: 'Lốc',
      currentStock: 0,
      minStockLevel: 100,
      maxStockLevel: 1000,
      costPrice: 45000,
      sellingPrice: 60000,
      lastUpdated: '2026-01-13 16:45',
      batches: []
    },
    {
      id: '4',
      productId: 'SP004',
      productCode: 'SP004',
      productName: 'Bánh quy Oreo',
      category: 'Bánh kẹo',
      unit: 'Hộp',
      currentStock: 200,
      minStockLevel: 80,
      maxStockLevel: 400,
      costPrice: 25000,
      sellingPrice: 35000,
      lastUpdated: '2026-01-14 08:00',
      batches: [
        { id: 'B004', batchNumber: 'LOT2026001', productId: 'SP004', quantity: 200, expiryDate: '2026-12-31', importDate: '2026-01-02', importReceiptCode: 'PN003', remainingQuantity: 200 }
      ]
    },
    {
      id: '5',
      productId: 'SP005',
      productCode: 'SP005',
      productName: 'Gạo ST25',
      category: 'Lương thực',
      unit: 'Kg',
      currentStock: 500,
      minStockLevel: 200,
      maxStockLevel: 2000,
      costPrice: 22000,
      sellingPrice: 28000,
      lastUpdated: '2026-01-14 11:00',
      batches: [
        { id: 'B005', batchNumber: 'LOT2025004', productId: 'SP005', quantity: 500, expiryDate: '2027-01-01', importDate: '2025-10-15', importReceiptCode: 'PN002', remainingQuantity: 500 }
      ]
    },
    {
      id: '6',
      productId: 'SP006',
      productCode: 'SP006',
      productName: 'Snack Oishi',
      category: 'Bánh kẹo',
      unit: 'Gói',
      currentStock: 15,
      minStockLevel: 50,
      maxStockLevel: 300,
      costPrice: 8000,
      sellingPrice: 12000,
      lastUpdated: '2026-01-14 07:30',
      batches: [
        { id: 'B006', batchNumber: 'LOT2025005', productId: 'SP006', quantity: 100, expiryDate: '2026-01-20', importDate: '2025-09-01', importReceiptCode: 'PN001', remainingQuantity: 15 }
      ]
    }
  ])

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

    // Đếm sản phẩm sắp hết hạn (trong vòng 30 ngày)
    const today = new Date()
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    let expiringCount = 0
    let expiredCount = 0
    
    inventory.forEach(item => {
      if (item.batches) {
        item.batches.forEach(batch => {
          if (batch.expiryDate && batch.remainingQuantity > 0) {
            const expiryDate = new Date(batch.expiryDate)
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
    const today = new Date()
    
    inventory.forEach(item => {
      // Cảnh báo hết hàng
      if (item.currentStock === 0) {
        alertList.push({
          id: `out-${item.id}`,
          productCode: item.productCode,
          productName: item.productName,
          alertType: 'out_of_stock',
          message: `${item.productName} đã HẾT HÀNG! Cần nhập thêm ngay.`,
          severity: 'critical',
          createdAt: new Date().toISOString()
        })
      } else if (item.currentStock <= item.minStockLevel) {
        // Cảnh báo sắp hết hàng
        alertList.push({
          id: `low-${item.id}`,
          productCode: item.productCode,
          productName: item.productName,
          alertType: 'low_stock',
          message: `${item.productName} sắp hết hàng (còn ${item.currentStock} ${item.unit}).`,
          severity: 'warning',
          createdAt: new Date().toISOString()
        })
      }
      
      // Cảnh báo hết hạn sử dụng
      if (item.batches) {
        item.batches.forEach(batch => {
          if (batch.expiryDate && batch.remainingQuantity > 0) {
            const expiryDate = new Date(batch.expiryDate)
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
            
            if (daysUntilExpiry <= 0) {
              alertList.push({
                id: `expired-${batch.id}`,
                productCode: item.productCode,
                productName: item.productName,
                alertType: 'expired',
                message: `${item.productName} (Lô ${batch.batchNumber}) ĐÃ HẾT HẠN! Còn ${batch.remainingQuantity} ${item.unit} cần xử lý.`,
                severity: 'critical',
                createdAt: new Date().toISOString()
              })
            } else if (daysUntilExpiry <= 30) {
              alertList.push({
                id: `expiring-${batch.id}`,
                productCode: item.productCode,
                productName: item.productName,
                alertType: 'expiring_soon',
                message: `${item.productName} (Lô ${batch.batchNumber}) sắp hết hạn trong ${daysUntilExpiry} ngày.`,
                severity: 'warning',
                createdAt: new Date().toISOString()
              })
            }
          }
        })
      }
    })

    // Sắp xếp: critical trước, sau đó là warning
    return alertList.sort((a, b) => {
      if (a.severity === 'critical' && b.severity !== 'critical') return -1
      if (a.severity !== 'critical' && b.severity === 'critical') return 1
      return 0
    })
  }, [inventory])

  // Lọc inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase())

      let matchStatus = true
      if (filterStatus === 'low') {
        matchStatus = item.currentStock > 0 && item.currentStock <= item.minStockLevel
      } else if (filterStatus === 'out') {
        matchStatus = item.currentStock === 0
      } else if (filterStatus === 'normal') {
        matchStatus = item.currentStock > item.minStockLevel
      }

      return matchSearch && matchStatus
    })
  }, [inventory, searchTerm, filterStatus])

  // Lấy hạn sử dụng gần nhất
  const getNearestExpiry = (item: InventoryItem): { date: string | null, daysLeft: number | null } => {
    if (!item.batches || item.batches.length === 0) {
      return { date: null, daysLeft: null }
    }
    
    const today = new Date()
    let nearestDate: Date | null = null
    
    item.batches.forEach(batch => {
      if (batch.expiryDate && batch.remainingQuantity > 0) {
        const expiry = new Date(batch.expiryDate)
        if (!nearestDate || expiry < nearestDate) {
          nearestDate = expiry
        }
      }
    })
    
    if (!nearestDate) return { date: null, daysLeft: null }
    
    const nearestDateValue = nearestDate as Date
    const daysLeft = Math.ceil((nearestDateValue.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
    return {
      date: nearestDateValue.toLocaleDateString('vi-VN'),
      daysLeft
    }
  }

  // Xác định trạng thái HSD
  const getExpiryStatus = (daysLeft: number | null) => {
    if (daysLeft === null) return { class: '', label: '-' }
    if (daysLeft <= 0) return { class: 'expiry-expired', label: 'Hết hạn' }
    if (daysLeft <= 30) return { class: 'expiry-warning', label: `${daysLeft} ngày` }
    if (daysLeft <= 90) return { class: 'expiry-soon', label: `${daysLeft} ngày` }
    return { class: 'expiry-normal', label: `${daysLeft} ngày` }
  }

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock === 0) {
      return { label: 'Hết hàng', class: 'status-out', icon: <XCircle size={14} /> }
    }
    if (item.currentStock <= item.minStockLevel) {
      return { label: 'Sắp hết', class: 'status-low', icon: <TrendingDown size={14} /> }
    }
    return { label: 'Còn hàng', class: 'status-normal', icon: <CheckCircle2 size={14} /> }
  }

  const handleViewDetail = (item: InventoryItem) => {
    setSelectedProduct(item)
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedProduct(null)
  }

  return (
    <div className="inventory-overview-page">
      {/* Header Section */}
      <div className="inventory-overview__header">
        <div className="inventory-overview__header-icon">
          <Warehouse size={36} />
        </div>
        <div className="inventory-overview__header-text">
          <h1 className="inventory-overview__title">Giám sát Kho hàng</h1>
          <p className="inventory-overview__subtitle">
            Tổng quan tình trạng tồn kho và cảnh báo.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="inventory-overview__stats-grid">
        <div className="inventory-overview__stat-card stat-blue">
          <div className="stat-icon-wrapper">
            <Package size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng sản phẩm</div>
            <div className="stat-value">{statistics.totalProducts}</div>
            <div className="stat-detail">Trong kho</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card stat-green">
          <div className="stat-icon-wrapper">
            <DollarSign size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Giá trị kho (Giá vốn)</div>
            <div className="stat-value">{(statistics.totalValue / 1000000).toFixed(1)}M</div>
            <div className="stat-detail">VND</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card stat-orange">
          <div className="stat-icon-wrapper">
            <TrendingDown size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Sắp hết hàng</div>
            <div className="stat-value">{statistics.lowStockCount}</div>
            <div className="stat-detail">Dưới mức tối thiểu</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card stat-red">
          <div className="stat-icon-wrapper">
            <XCircle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Hết hàng</div>
            <div className="stat-value">{statistics.outOfStockCount}</div>
            <div className="stat-detail">Cần nhập thêm</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card stat-purple">
          <div className="stat-icon-wrapper">
            <Clock size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Sắp hết hạn</div>
            <div className="stat-value">{statistics.expiringCount}</div>
            <div className="stat-detail">Trong 30 ngày tới</div>
          </div>
        </div>

        <div className="inventory-overview__stat-card stat-dark-red">
          <div className="stat-icon-wrapper">
            <AlertTriangle size={28} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Đã hết hạn</div>
            <div className="stat-value">{statistics.expiredCount}</div>
            <div className="stat-detail">Cần xử lý</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="inventory-overview__tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Package size={18} />
          Tổng quan tồn kho
        </button>
        <button 
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <AlertTriangle size={18} />
          Cảnh báo ({alerts.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="inventory-overview__content">
          {/* Filters */}
          <div className="inventory-overview__filters">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Tất cả ({statistics.totalProducts})
              </button>
              <button 
                className={`filter-btn filter-normal ${filterStatus === 'normal' ? 'active' : ''}`}
                onClick={() => setFilterStatus('normal')}
              >
                <CheckCircle2 size={14} />
                Còn hàng ({statistics.normalStockCount})
              </button>
              <button 
                className={`filter-btn filter-low ${filterStatus === 'low' ? 'active' : ''}`}
                onClick={() => setFilterStatus('low')}
              >
                <TrendingDown size={14} />
                Sắp hết ({statistics.lowStockCount})
              </button>
              <button 
                className={`filter-btn filter-out ${filterStatus === 'out' ? 'active' : ''}`}
                onClick={() => setFilterStatus('out')}
              >
                <XCircle size={14} />
                Hết hàng ({statistics.outOfStockCount})
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="inventory-overview__table-wrapper">
            <table className="inventory-overview__table">
              <thead>
                <tr>
                  <th>MÃ SP</th>
                  <th>TÊN SẢN PHẨM</th>
                  <th>TỔNG TỒN</th>
                  <th>ĐỊNH MỨC</th>
                  <th>ĐƠN VỊ</th>
                  <th>HSD GẦN NHẤT</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item)
                    const expiry = getNearestExpiry(item)
                    const expiryStatus = getExpiryStatus(expiry.daysLeft)
                    
                    return (
                      <tr key={item.id}>
                        <td>
                          <span className="product-code">{item.productCode}</span>
                        </td>
                        <td>
                          <span className="product-name">{item.productName}</span>
                        </td>
                        <td>
                          <span className={`stock-value ${item.currentStock <= item.minStockLevel ? 'stock-low' : ''} ${item.currentStock === 0 ? 'stock-out' : ''}`}>
                            {item.currentStock.toLocaleString('vi-VN')}
                          </span>
                        </td>
                        <td>{item.minStockLevel.toLocaleString('vi-VN')}</td>
                        <td>{item.unit}</td>
                        <td>
                          {expiry.date ? (
                            <div className={`expiry-info ${expiryStatus.class}`}>
                              <Calendar size={14} />
                              <span className="expiry-date">{expiry.date}</span>
                              <span className="expiry-days">({expiryStatus.label})</span>
                            </div>
                          ) : (
                            <span className="no-expiry">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${status.class}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn-view-detail"
                            onClick={() => handleViewDetail(item)}
                            title="Xem chi tiết lô hàng"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="no-data">
                      <Package size={48} />
                      <p>Không tìm thấy sản phẩm nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="inventory-overview__alerts">
          {alerts.length > 0 ? (
            <div className="alerts-list">
              {alerts.map((alert) => (
                <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                  <div className="alert-icon">
                    {alert.alertType === 'out_of_stock' && <XCircle size={24} />}
                    {alert.alertType === 'low_stock' && <TrendingDown size={24} />}
                    {alert.alertType === 'expiring_soon' && <Clock size={24} />}
                    {alert.alertType === 'expired' && <AlertTriangle size={24} />}
                  </div>
                  <div className="alert-content">
                    <div className="alert-header">
                      <span className="alert-product-code">{alert.productCode}</span>
                      <span className={`alert-type-badge ${alert.alertType}`}>
                        {alert.alertType === 'out_of_stock' && 'Hết hàng'}
                        {alert.alertType === 'low_stock' && 'Sắp hết'}
                        {alert.alertType === 'expiring_soon' && 'Sắp hết hạn'}
                        {alert.alertType === 'expired' && 'Đã hết hạn'}
                      </span>
                    </div>
                    <p className="alert-message">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-alerts">
              <CheckCircle2 size={64} />
              <h3>Không có cảnh báo</h3>
              <p>Kho hàng đang hoạt động bình thường.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Chi tiết Lô hàng */}
      {showDetailModal && selectedProduct && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content modal-batch-detail" onClick={e => e.stopPropagation()}>
            <div className="modal-header-batch">
              <h2>Chi tiết lô - {selectedProduct.productName}</h2>
              <button className="modal-close-batch" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-batch">
              {selectedProduct.batches && selectedProduct.batches.length > 0 ? (
                <table className="batch-table">
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
                    {selectedProduct.batches.map((batch) => {
                      const today = new Date()
                      const expiryDate = new Date(batch.expiryDate)
                      const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
                      
                      let statusClass = 'status-normal'
                      let statusLabel = 'Bình thường'
                      if (daysLeft <= 0) {
                        statusClass = 'status-expired'
                        statusLabel = 'Hết hạn'
                      } else if (daysLeft <= 30) {
                        statusClass = 'status-warning'
                        statusLabel = 'Sắp hết hạn'
                      }
                      
                      return (
                        <tr key={batch.id}>
                          <td>
                            <span className="batch-code">{batch.batchNumber}</span>
                          </td>
                          <td>{new Date(batch.importDate).toLocaleDateString('vi-VN')}</td>
                          <td>{new Date(batch.expiryDate).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <span className="batch-qty">{batch.remainingQuantity.toLocaleString('vi-VN')}</span>
                          </td>
                          <td>
                            <span className={`batch-status ${statusClass}`}>
                              {statusLabel}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="no-batches">
                  <Package size={48} />
                  <p>Chưa có lô hàng nào</p>
                </div>
              )}
            </div>

            <div className="modal-footer-batch">
              <button className="btn-close-modal" onClick={handleCloseModal}>
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
