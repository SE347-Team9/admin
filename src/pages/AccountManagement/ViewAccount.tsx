import { Users, ArrowLeft, Edit, Building2, MapPin, CreditCard } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import './ViewAccount.css'

interface AccountData {
  id: string
  code: string
  username: string
  fullName: string
  email: string
  phone: string
  role: 'admin' | 'staff' | 'agency'
  roleLabel: string
  status: 'active' | 'inactive'
  statusLabel: string
  createdAt: string
  updatedAt: string
  // Agency specific fields
  agencyType?: string
  agencyTypeLabel?: string
  agencyName?: string
  agencyOwner?: string
  agencyAddress?: string
  debtLimit?: number
}

const ViewAccount = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock data - should fetch from API based on id
  // Example data for different roles
  const mockAccounts: Record<string, AccountData> = {
    '1': {
      id: '1',
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
    },
    '2': {
      id: '2',
      code: 'DL001',
      username: 'agency01',
      fullName: 'Trần Thị B',
      email: 'agency01@example.com',
      phone: '0987654321',
      role: 'agency',
      roleLabel: 'Đại lý',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '15/02/2024',
      updatedAt: '25/12/2025',
      agencyType: '1',
      agencyTypeLabel: 'Đại lý cấp 1',
      agencyName: 'Đại lý Minh Phát',
      agencyOwner: 'Trần Thị B',
      agencyAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
      debtLimit: 50000000
    },
    '3': {
      id: '3',
      code: 'NV001',
      username: 'staff01',
      fullName: 'Lê Văn C',
      email: 'staff01@example.com',
      phone: '0369852147',
      role: 'staff',
      roleLabel: 'Nhân viên',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '20/03/2024',
      updatedAt: '10/11/2025'
    }
  }

  const account = mockAccounts[id || '1'] || mockAccounts['1']

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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
                <span className="view-account__info-label">Trạng thái:</span>
                <span className={`view-account__status ${account.status}`}>
                  {account.statusLabel}
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
            </div>
          </div>

          {/* Agency Information Section - Only show for agency role */}
          {account.role === 'agency' && (
            <div className="view-account__card view-account__card--agency">
              <h2 className="view-account__card-title view-account__card-title--agency">
                <Building2 size={22} />
                Thông tin đại lý
              </h2>
              <div className="view-account__info-grid">
                <div className="view-account__info-item">
                  <span className="view-account__info-label">Loại đại lý:</span>
                  <span className="view-account__info-value view-account__agency-type">
                    {account.agencyTypeLabel}
                  </span>
                </div>

                <div className="view-account__info-item">
                  <span className="view-account__info-label">Tên đại lý:</span>
                  <span className="view-account__info-value">{account.agencyName}</span>
                </div>

                <div className="view-account__info-item">
                  <span className="view-account__info-label">Chủ đại lý:</span>
                  <span className="view-account__info-value">{account.agencyOwner}</span>
                </div>

                <div className="view-account__info-item">
                  <span className="view-account__info-label">
                    <CreditCard size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Hạn mức nợ:
                  </span>
                  <span className="view-account__info-value view-account__debt-limit">
                    {account.debtLimit ? formatCurrency(account.debtLimit) : 'Chưa thiết lập'}
                  </span>
                </div>

                <div className="view-account__info-item view-account__info-item--full">
                  <span className="view-account__info-label">
                    <MapPin size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Địa chỉ:
                  </span>
                  <span className="view-account__info-value">{account.agencyAddress}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="view-account__card">
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
