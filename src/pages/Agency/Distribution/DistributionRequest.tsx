import { useState } from 'react'
import { Package, Plus, Clock, Send, RotateCcw, MapPin } from 'lucide-react'
import './DistributionRequest.css'

interface Product {
  id: string
  name: string
  quantity: number
  unit: string
  price: number
}

interface ProductInputRow {
  rowId: string
  selectedProduct: string
  quantity: number
  unit: string
  price: number
}

interface OrderHistory {
  id: string
  code: string
  status: string
  productCount: number
  address: string
  date: string
  sender: string
  products: { name: string; quantity: number }[]
}

const DistributionRequest = () => {
  // Agency debt info
  const agencyDebtInfo = {
    currentDebt: 5000000, // 5 triệu đ
    creditLimit: 50000000 // 50 triệu đ
  }

  // Product database with units and prices
  const productDatabase = [
    { id: '1', name: 'Nước ngọt Pepsi', unit: 'Thùng', price: 120000 },
    { id: '2', name: 'Sữa Vinamilk', unit: 'Lốc', price: 85000 },
    { id: '3', name: 'Bánh quy Oreo', unit: 'Hộp', price: 45000 }
  ]

  const [productRows, setProductRows] = useState<ProductInputRow[]>([
    { rowId: Date.now().toString(), selectedProduct: '', quantity: 1, unit: '', price: 0 }
  ])
  const [products, setProducts] = useState<Product[]>([])
  const [onHold, setOnHold] = useState(false)

  // Mock data for order history
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([
    {
      id: '1',
      code: 'DH001',
      status: 'Không xác định',
      productCount: 2,
      address: 'Địa chỉ từ hệ thống',
      date: '11/7/2025',
      sender: 'Nguyễn Trọng Đại',
      products: [
        { name: 'Nước ngọt Pepsi', quantity: 80 },
        { name: 'Sữa Vinamilk', quantity: 3 }
      ]
    }
  ]);

  const handleAddProductRow = () => {
    setProductRows([
      ...productRows,
      { rowId: Date.now().toString(), selectedProduct: '', quantity: 1, unit: '', price: 0 }
    ])
  }

  const handleRemoveProductRow = (rowId: string) => {
    setProductRows(productRows.filter(row => row.rowId !== rowId))
  }

  const handleProductRowChange = (rowId: string, field: string, value: any) => {
    setProductRows(productRows.map(row => {
      if (row.rowId === rowId) {
        const updatedRow = { ...row, [field]: value }
        
        // Auto-fill unit and price when product is selected
        if (field === 'selectedProduct') {
          const product = productDatabase.find(p => p.name === value)
          if (product) {
            updatedRow.unit = product.unit
            updatedRow.price = product.price
          } else {
            updatedRow.unit = ''
            updatedRow.price = 0
          }
        }
        
        return updatedRow
      }
      return row
    }))
  }

  // Calculate total amount
  const calculateTotal = () => {
    return productRows.reduce((sum, row) => {
      if (row.selectedProduct && row.quantity > 0) {
        return sum + (row.price * row.quantity)
      }
      return sum
    }, 0)
  }

  // Check if request can be created based on debt limit
  const canCreateRequest = () => {
    const total = calculateTotal()
    const newTotalDebt = agencyDebtInfo.currentDebt + total
    return newTotalDebt <= agencyDebtInfo.creditLimit
  }

  const getRemainingDebtLimit = () => {
    return agencyDebtInfo.creditLimit - agencyDebtInfo.currentDebt
  }

  const handleSubmit = () => {
    // Check debt limit before creating order
    if (!canCreateRequest()) {
      alert('Công nợ hiện tại cộng tổng tiền yêu cầu vượt quá hạn mức cho phép. Vui lòng giảm số lượng hoặc thanh toán công nợ.');
      return;
    }

    // Tạo đơn hàng mới từ dữ liệu form
    if (productRows.length === 0) return;
    const newProducts = productRows
      .filter(row => row.selectedProduct && row.quantity > 0)
      .map(row => ({ name: row.selectedProduct, quantity: row.quantity }));
    if (newProducts.length === 0) return;
    const newOrder: OrderHistory = {
      id: Date.now().toString(),
      code: `DH${(orderHistory.length + 1).toString().padStart(3, '0')}`,
      status: 'Không xác định',
      productCount: newProducts.length,
      address: 'Địa chỉ từ hệ thống',
      date: new Date().toLocaleDateString('vi-VN'),
      sender: 'Nguyễn Trọng Đại',
      products: newProducts
    };
    setOrderHistory([newOrder, ...orderHistory]);
    // Reset form
    setProductRows([{ rowId: Date.now().toString(), selectedProduct: '', quantity: 1, unit: '', price: 0 }]);
    setOnHold(false);
  }

  const handleReset = () => {
    setProducts([])
    setOnHold(false)
    setProductRows([{ rowId: Date.now().toString(), selectedProduct: '', quantity: 1, unit: '', price: 0 }])
  }

  return (
    <div className="distribution-request">
      {/* Header */}
      <div className="distribution-header">
        <div className="header-icon-box">
          <Package size={36} />
        </div>
        <div className="header-text">
          <h1 className="distribution-title">Hệ thống Phân phối Hàng hóa</h1>
          <p className="distribution-subtitle">
            Gửi yêu cầu phân phối sản phẩm một cách nhanh chóng và theo dõi trạng thái real-time
          </p>
        </div>
      </div>

      {/* Create New Request Form */}
      <div className="request-form-section">
        <div className="form-header">
          <Send size={20} />
          <h2>Tạo yêu cầu mới</h2>
        </div>
        <p className="form-description">Điền thông tin chi tiết để gửi yêu cầu phân phối</p>

        <div className="form-content">
          {/* Product List Section */}
          <div className="distribution-request__form-group">
            <label className="distribution-request__form-label">
              <Package size={18} />
              <span>Danh sách sản phẩm</span>
              <span className="required">*</span>
            </label>

            {productRows.map((row) => (
              <div key={row.rowId} className="product-input-row">
                <div className="input-group">
                  <label>Sản phẩm</label>
                  <select 
                    className="distribution-request__form-select"
                    value={row.selectedProduct}
                    onChange={(e) => handleProductRowChange(row.rowId, 'selectedProduct', e.target.value)}
                  >
                    <option value="">Chọn sản phẩm...</option>
                    {productDatabase.map((product) => (
                      <option key={product.id} value={product.name}>{product.name}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label>Số lượng</label>
                  <input 
                    type="number" 
                    className="distribution-request__form-input"
                    value={row.quantity}
                    onChange={(e) => handleProductRowChange(row.rowId, 'quantity', Number(e.target.value))}
                    min="1"
                  />
                </div>

                <div className="input-group">
                  <label>Đơn vị tính</label>
                  <input 
                    type="text" 
                    className="distribution-request__form-input disabled"
                    value={row.unit || 'Chọn sản phẩm trước'}
                    disabled
                  />
                </div>

                <div className="input-group">
                  <label>Thành tiền</label>
                  <div className="input-with-delete">
                    <input 
                      type="text" 
                      className="distribution-request__form-input disabled"
                      value={row.selectedProduct ? `${(row.price * row.quantity).toLocaleString('vi-VN')} ₫` : '0 ₫'}
                      disabled
                    />
                    {productRows.length > 1 && (
                      <button 
                        className="btn-remove-row"
                        onClick={() => handleRemoveProductRow(row.rowId)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button 
              className="btn-add-row"
              onClick={handleAddProductRow}
            >
              <Plus size={16} />
              Thêm sản phẩm
            </button>

            {/* Total Amount Display */}
            <div className="total-amount-section">
              <div className="total-label">Tổng tiền:</div>
              <div className="total-value">{calculateTotal().toLocaleString('vi-VN')} ₫</div>
            </div>

            {/* Debt Information */}
            <div className="debt-info-section">
              <div className="debt-item">
                <span className="debt-label">Công nợ hiện tại:</span>
                <span className="debt-value">{agencyDebtInfo.currentDebt.toLocaleString('vi-VN')} ₫</span>
              </div>
              <span className="debt-divider">/</span>
              <div className="debt-item">
                <span className="debt-label">Hạn mức:</span>
                <span className="debt-value">{agencyDebtInfo.creditLimit.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            {products.length > 0 && (
              <div className="added-products">
                {products.map((product) => (
                  <div key={product.id} className="product-tag">
                    <Package size={14} />
                    <span>{product.name} - {product.quantity} {product.unit}</span>
                    <button 
                      className="remove-btn"
                      onClick={() => setProducts(products.filter(p => p.id !== product.id))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Testing Tools Section */}
          <div className="testing-section">
            <div className="testing-header">
              <span>🔧</span>
              <span>Công cụ Test</span>
            </div>
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={onHold}
                onChange={(e) => setOnHold(e.target.checked)}
              />
              <span>Bước trạng thái "Tạm hoãn" cho yêu cầu tiếp theo</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              className="btn-submit" 
              onClick={handleSubmit}
              disabled={!canCreateRequest()}
              title={!canCreateRequest() ? `Công nợ sẽ vượt hạn mức. Còn lại: ${getRemainingDebtLimit().toLocaleString('vi-VN')} ₫` : ''}
            >
              <Send size={20} />
              Gửi yêu cầu phân phối
            </button>
            <button className="btn-reset" onClick={handleReset}>
              <RotateCcw size={20} />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Order History Section */}
      <div className="order-history-section">
        <div className="history-header">
          <Clock size={24} />
          <h2>Lịch sử đơn hàng</h2>
          <span className="history-count">{orderHistory.length} yêu cầu</span>
        </div>

        <div className="history-list">
          {orderHistory.map((order) => (
            <div key={order.id} className="history-card">
              <div className="history-card-header">
                <div className="order-code">
                  <strong>{order.code}</strong>
                </div>
              </div>

              <div className="history-card-body">
                <div className="history-info-row">
                  <div className="info-item">
                    <Package size={16} />
                    <span>{order.productCount} sản phẩm</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{order.date}</span>
                  </div>
                </div>

                <div className="product-list">
                  <strong>Danh sách sản phẩm:</strong>
                  <ul>
                    {order.products.map((product, idx) => (
                      <li key={idx}>
                        {product.name}: {product.quantity} Cái
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="confirm-receive-text">
                  Chờ duyệt bởi nhân viên
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Information Section */}
      <div className="info-section">
        <div className="info-section-header">
          <div className="info-icon">
            <Package size={28} />
          </div>
          <h3>Thông tin quan trọng</h3>
        </div>
        <div className="info-grid">
          <div className="info-card">
            <Clock size={20} />
            <span>Xử lý trong 24-48 giờ làm việc</span>
          </div>
          <div className="info-card">
            <MapPin size={20} />
            <span>Địa chỉ phải chính xác</span>
          </div>
          <div className="info-card">
            <Package size={20} />
            <span>Kiểm tra hạn mức sản phẩm</span>
          </div>
          <div className="info-card">
            <Send size={20} />
            <span>Cập nhật trạng thái tự động</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DistributionRequest



