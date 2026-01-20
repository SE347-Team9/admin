import { Users, ArrowLeft, Edit, Building2, MapPin, CreditCard } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { accountService } from '../../api/endpoints/accountService'
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
  const [account, setAccount] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccount = async () => {
      if (!id) return

      try {
        setLoading(true)
        const response = await accountService.getById(id)
        if (response.success) {
          const acc = response.data
          setAccount({
            id: acc.id,
            code: acc.code,
            username: acc.username,
            fullName: acc.fullName,
            email: acc.email,
            phone: acc.phone,
            role: acc.role as 'admin' | 'agency' | 'staff',
            roleLabel: acc.role === 'admin' ? 'Quản trị viên' : acc.role === 'agency' ? 'Đại lý' : 'Nhân viên',
            status: acc.status as 'active' | 'inactive',
            statusLabel: acc.status === 'active' ? 'Hoạt động' : 'Không hoạt động',
            createdAt: new Date(acc.createdAt).toLocaleDateString('vi-VN'),
            updatedAt: new Date(acc.updatedAt).toLocaleDateString('vi-VN')
          })
        }
      } catch (error) {
        console.error('Error fetching account:', error)
        toast.error('Không thể tải thông tin tài khoản')
        navigate('/admin/account-management')
      } finally {
        setLoading(false)
      }
    }

    fetchAccount()
  }, [id, navigate])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleBack = () => {
    navigate('/admin/account-management')
  }

  const handleEdit = () => {
    navigate(`/admin/edit-account/${id}`)
  }

  return (
    <div className="view-account-page">
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : !account ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Không tìm thấy tài khoản</div>
      ) : (
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
      )}
    </div>
  )
}

export default ViewAccount
