import { ArrowLeft, Calendar, FileText, Package2, DollarSign } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import '../ReceiveGood/ViewReceive.css'

interface Product {
  name: string
  batch: string
  mfgDate: string
  expDate: string
  quantity: number
  price: number
}

interface ReceiveRecord {
  id: string
  code: string
  shipDate: string
  receiveDate: string
  agency: {
    name: string
    phone: string
  }
  products: Product[]
  totalAmount: number
  status: 'received' | 'pending' | 'cancelled'
}

const ViewReceive = () => {
  const navigate = useNavigate()
  const { code } = useParams<{ code: string }>()

  // Mock data - in real app, fetch from API/localStorage
  const mockRecords: Record<string, ReceiveRecord> = {
    'PX002': {
      id: '1',
      code: 'PX002',
      shipDate: '2024-05-10',
      receiveDate: '2024-05-11',
      agency: {
        name: 'Đại lý Đại',
        phone: '0123456789'
      },
      products: [
        { 
          name: 'Nước ngọt Pepsi', 
          batch: 'LO-20260110', 
          mfgDate: '2024-01-15', 
          expDate: '2025-01-15', 
          quantity: 80, 
          price: 9000 
        },
        { 
          name: 'Sữa Vinamilk', 
          batch: 'LO-20260110', 
          mfgDate: '2024-02-20', 
          expDate: '2025-02-20', 
          quantity: 3, 
          price: 60000 
        }
      ],
      totalAmount: 900000,
      status: 'received'
    }
  }

  const record = code ? mockRecords[code] : null

  if (!record) {
    return (
      <div className="view-receive">
        <div className="error-message">Không tìm thấy phiếu nhận hàng</div>
      </div>
    )
  }

  const calculateLineTotal = (quantity: number, price: number) => {
    return quantity * price
  }

  return (
    <div className="view-receive">
      {/* Header */}
      <div className="view-header">
        <button className="back-btn" onClick={() => navigate('/agency/receive-goods')}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <h1 className="view-title">Chi Tiết Phiếu Nhận Hàng</h1>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-grid">
          <div className="info-item">
            <label className="info-label">
              <FileText size={16} />
              Mã Phiếu Nhận
            </label>
            <div className="info-value">{record.code}</div>
          </div>

          <div className="info-item">
            <label className="info-label">
              <Calendar size={16} />
              Ngày Giao Hàng
            </label>
            <div className="info-value">{new Date(record.shipDate).toLocaleDateString('vi-VN')}</div>
          </div>

          <div className="info-item">
            <label className="info-label">
              <Calendar size={16} />
              Ngày Nhận Hàng
            </label>
            <div className="info-value">{new Date(record.receiveDate).toLocaleDateString('vi-VN')}</div>
          </div>

          <div className="info-item">
            <label className="info-label">
              <Package2 size={16} />
              Đại Lý
            </label>
            <div className="info-value">{record.agency.name}</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-section">
        <h2 className="section-title">Danh Sách Sản Phẩm</h2>
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th className="col-product">Sản Phẩm</th>
                <th className="col-batch">Lô Hàng</th>
                <th className="col-mfg">NSX</th>
                <th className="col-exp">HSD</th>
                <th className="col-quantity">Số Lượng</th>
                <th className="col-price">Đơn Giá</th>
                <th className="col-total">Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              {record.products.map((product, idx) => (
                <tr key={idx}>
                  <td className="col-stt">{idx + 1}</td>
                  <td className="col-product">{product.name}</td>
                  <td className="col-batch">
                    <span className="batch-badge">{product.batch}</span>
                  </td>
                  <td className="col-mfg">{new Date(product.mfgDate).toLocaleDateString('vi-VN')}</td>
                  <td className="col-exp">{new Date(product.expDate).toLocaleDateString('vi-VN')}</td>
                  <td className="col-quantity text-center">{product.quantity}</td>
                  <td className="col-price text-right">{product.price.toLocaleString('vi-VN')} VND</td>
                  <td className="col-total text-right font-bold">
                    {calculateLineTotal(product.quantity, product.price).toLocaleString('vi-VN')} VND
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Section */}
      <div className="summary-section">
        <div className="summary-item">
          <span className="summary-label">Tổng Số Mặt Hàng:</span>
          <span className="summary-value">{record.products.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Tổng Số Lượng:</span>
          <span className="summary-value">
            {record.products.reduce((sum, p) => sum + p.quantity, 0)}
          </span>
        </div>
        <div className="summary-item total">
          <DollarSign size={20} />
          <span className="summary-label">Tổng Giá Trị:</span>
          <span className="summary-value">{record.totalAmount.toLocaleString('vi-VN')} VND</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={() => navigate('/agency/receive-goods')}>
          Quay Lại
        </button>
      </div>
    </div>
  )
}

export default ViewReceive



