import { Link } from 'react-router-dom'
import { Package, CheckCircle2 } from 'lucide-react'
import './ExportManagement.css'

const ExportManagement = () => {
  return (
    <div className="export-management">
      <div className="export-header">
        <div className="header-icon-box">
          <Package size={36} />
        </div>
        <div className="header-text">
          <h1 className="export-title">Quản lý xuất hàng</h1>
          <p className="export-subtitle">
            Lựa chọn chức năng phù hợp để quản lý quy trình xuất hàng của bạn một cách hiệu quả.
          </p>
        </div>
      </div>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="card-icon-wrapper blue">
            <Package className="card-icon" size={40} strokeWidth={2} />
          </div>
          
          <h2 className="card-title">Yêu cầu phân phối</h2>
          
          <span className="card-badge blue">Đơn hàng mới</span>
          
          <p className="card-description">
            Gửi yêu cầu xuất hàng mới cho đại lý của bạn. Quản lý và theo dõi các đơn hàng xuất một cách dễ dàng và hiệu quả.
          </p>
          
          <Link to="/distribution-request" className="card-button">
            Tạo yêu cầu mới
          </Link>
        </div>

        <div className="feature-card">
          <div className="card-icon-wrapper green">
            <CheckCircle2 className="card-icon" size={40} strokeWidth={2} />
          </div>
          
          <h2 className="card-title">Xác nhận nhận hàng</h2>
          
          <span className="card-badge green">Đã nhận hàng</span>
          
          <p className="card-description">
            Quản lý, xác nhận và theo dõi các phiếu xuất hàng đã nhận một cách nhanh chóng, chính xác.
          </p>
          
          <Link to="/receive-goods" className="card-button">
            Xem danh sách
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ExportManagement



