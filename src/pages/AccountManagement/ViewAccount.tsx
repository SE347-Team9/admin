import { Users, ArrowLeft, Edit } from 'lucide-react'
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
      <div className="view-account-container">
        {/* Header */}
        <div className="view-account__header">
          <div className="view-account__header-icon">
            <Users size={36} />
          </div>
          <div className="view-account__header-content">
            <h1 className="view-account__title">Chi tiết tài khoản</h1>
            <p className="view-account__subtitle">
              Xem thông tin chi tiết của tài khoản trong hệ thống
            </p>
          </div>
        </div>

        {/* Content and Footer Combined */}
        <div className="view-account__content">
          <div className="view-account__card">
            <h2 className="view-account__card-title">Thông tin tài khoản</h2>
            <div className="view-account__info-grid">
              <div className="view-account__info-item">
                <span className="view-account__info-label">Mã tài khoản:</span>
                <span className="view-account__info-value view-account__code">{account.code}</span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Tên đăng nhập:</span>
                <span className="view-account__info-value">{account.username}</span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Họ và tên:</span>
                <span className="view-account__info-value">{account.fullName}</span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Email:</span>
                <span className="view-account__info-value">{account.email}</span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Số điện thoại:</span>
                <span className="view-account__info-value">{account.phone}</span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Vai trò:</span>
                <span className={`view-account__role ${account.role}`}>
                  {account.roleLabel}
                </span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Ngày tạo:</span>
                <span className="view-account__info-value">{account.createdAt}</span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Cập nhật lần cuối:</span>
                <span className="view-account__info-value">{account.updatedAt}</span>
              </div>

              <div className="view-account__info-item">
                <span className="view-account__info-label">Trạng thái:</span>
                <span className={`view-account__status ${account.status}`}>
                  {account.statusLabel}
                </span>
              </div>
            </div>

            {/* Footer Actions - Inside Card */}
            <div className="view-account__footer">
              <button className="view-account__btn view-account__btn--secondary" onClick={handleBack}>
                <ArrowLeft size={20} />
                Quay lại danh sách
              </button>
              <button className="view-account__btn view-account__btn--primary" onClick={handleEdit}>
                <Edit size={20} />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewAccount
