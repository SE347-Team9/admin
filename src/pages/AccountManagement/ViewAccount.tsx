import { Eye, ArrowLeft, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import './ViewAccount.css'

const ViewAccount = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock data - should fetch from API based on id
  const account = {
    id: id || '1',
    code: 'ADM001',
    username: 'admin01',
    fullName: 'Nguyễn Văn A',
    email: 'admin01@example.com',
    phone: '0123456789',
    role: 'admin',
    roleLabel: 'Quản trị viên',
    status: 'active',
    statusLabel: 'Hoạt động',
    createdAt: '01/01/2024',
    updatedAt: '20/10/2025'
  }

  const handleBack = () => {
    navigate('/account-management')
  }

  const handleEdit = () => {
    navigate(`/edit-account/${id}`)
  }

  return (
    <div className="view-account-page">
      <div className="view-account-header">
        <div className="header-icon-box">
          <Eye size={36} />
        </div>
        <div className="header-text">
          <h1 className="view-account-title">Chi tiết tài khoản</h1>
          <p className="view-account-subtitle">
            Xem thông tin chi tiết của tài khoản trong hệ thống
          </p>
        </div>
      </div>

      <div className="view-account-content">
        <div className="account-info-card">
          <div className="card-header">
            <h3>Thông tin tài khoản</h3>
            <button className="btn-edit-small" onClick={handleEdit}>
              <Edit size={18} />
              Chỉnh sửa
            </button>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Mã tài khoản:</label>
              <span className="info-value code">{account.code}</span>
            </div>

            <div className="info-item">
              <label>Tên đăng nhập:</label>
              <span className="info-value">{account.username}</span>
            </div>

            <div className="info-item">
              <label>Họ và tên:</label>
              <span className="info-value">{account.fullName}</span>
            </div>

            <div className="info-item">
              <label>Email:</label>
              <span className="info-value">{account.email}</span>
            </div>

            <div className="info-item">
              <label>Số điện thoại:</label>
              <span className="info-value">{account.phone}</span>
            </div>

            <div className="info-item">
              <label>Vai trò:</label>
              <span className={`info-badge role-${account.role}`}>
                {account.roleLabel}
              </span>
            </div>

            <div className="info-item">
              <label>Trạng thái:</label>
              <span className={`info-badge status-${account.status}`}>
                {account.statusLabel}
              </span>
            </div>

            <div className="info-item">
              <label>Ngày tạo:</label>
              <span className="info-value">{account.createdAt}</span>
            </div>

            <div className="info-item">
              <label>Cập nhật lần cuối:</label>
              <span className="info-value">{account.updatedAt}</span>
            </div>
          </div>
        </div>

        <div className="action-section">
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>
          <button className="btn-edit" onClick={handleEdit}>
            <Edit size={20} />
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewAccount
