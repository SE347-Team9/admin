import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Users, Mail, Phone, Lock, ArrowLeft, CheckCircle2, XCircle, Building2, MapPin, CreditCard } from 'lucide-react'
import { toast } from 'react-toastify'
import { accountService } from '../../api/endpoints/accountService'
import './EditAccount.css'

interface Account {
  username: string
  fullName: string
  email: string
  phone: string
  role: string
  status: string
  agencyType?: string | number
  agencyName?: string
  agencyAddress?: string
  debtLimit?: string | number
}

const EditAccount = () => {
  const navigate = useNavigate()
  const { accountId } = useParams<{ accountId: string }>()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active',
    password: '',
    confirmPassword: '',
    // Agency specific fields
    agencyType: '1',
    agencyName: '',
    agencyOwner: '',
    agencyAddress: '',
    debtLimit: ''
  })

  // Load account data based on ID
  useEffect(() => {
    const fetchAccount = async () => {
      if (!accountId) return
      
      try {
        setLoading(true)
        const response = await accountService.getById(accountId)
        if (response.success) {
          const account = response.data
            setFormData({
            username: account.username,
            fullName: account.fullName,
            email: account.email,
            phone: account.phone,
            role: account.role,
            status: account.status,
            password: '',
            confirmPassword: '',
            agencyType: (account as any).agencyType ? String((account as any).agencyType) : '1',
            agencyName: (account as any).agencyName || '',
            agencyOwner: account.fullName || '',
            agencyAddress: (account as any).agencyAddress || '',
            debtLimit: (account as any).debtLimit ? String((account as any).debtLimit) : ''
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
  }, [accountId, navigate])

  const roles = [
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'agency', label: 'Đại lý' },
    { value: 'staff', label: 'Nhân viên' }
  ]

  const statuses = [
    { value: 'active', label: 'Hoạt động', icon: CheckCircle2 },
    { value: 'inactive', label: 'Ngừng hoạt động', icon: XCircle }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    navigate('/admin/account-management')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }

    // If password is provided, check if it matches
    if (formData.password) {
      if (formData.password.length < 6) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Mật khẩu xác nhận không khớp')
        return
      }
    }

    // Validation for agency role
    if (formData.role === 'agency') {
      if (!formData.agencyName.trim()) {
        toast.error('Vui lòng nhập tên đại lý!')
        return
      }
      if (!formData.agencyOwner.trim()) {
        toast.error('Vui lòng nhập tên chủ đại lý!')
        return
      }
      if (!formData.agencyAddress.trim()) {
        toast.error('Vui lòng nhập địa chỉ đại lý!')
        return
      }
    }

    if (!accountId) return

    try {
      setSubmitting(true)
      const updateData: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      }

      // Only include password if it was changed
      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await accountService.update(accountId, updateData)
      
      if (response.success) {
        toast.success(`Cập nhật tài khoản ${formData.username} thành công!`)
        navigate('/admin/account-management')
      }
    } catch (error: any) {
      console.error('Error updating account:', error)
      const errorMsg = error.response?.data?.message || 'Không thể cập nhật tài khoản'
      toast.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="edit-account-page">
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Header Section */}
          <div className="edit-account__header">
            <div className="edit-account__header-icon">
              <Users size={36} />
            </div>
            <div className="edit-account__header-text">
              <h1 className="edit-account__title">Chỉnh sửa tài khoản</h1>
              <p className="edit-account__subtitle">Cập nhật thông tin tài khoản người dùng</p>
            </div>
          </div>

      {/* Form Section */}
      <form className="edit-account__form-card" onSubmit={handleSubmit}>
        {/* Account Information Section */}
        <div className="edit-account__section-title">
          Thông tin tài khoản
        </div>

        {/* Username (Read-only) */}
        <div className="edit-account__form-group edit-account__form-group--full">
          <label className="edit-account__label">
            Tên đăng nhập <span className="edit-account__required">*</span>
          </label>
          <input
            type="text"
            value={formData.username}
            className="edit-account__input edit-account__input--readonly"
            disabled
          />
          <span className="edit-account__hint">Tên đăng nhập không thể thay đổi</span>
        </div>

        {/* Full Name */}
        <div className="edit-account__form-group edit-account__form-group--full">
          <label className="edit-account__label">
            Họ và tên <span className="edit-account__required">*</span>
          </label>
          <div className="edit-account__input-wrapper">
            <Users className="edit-account__input-icon" size={20} />
            <input
              type="text"
              name="fullName"
              className="edit-account__input"
              placeholder="VD: Nguyễn Văn A"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Email and Phone */}
        <div className="edit-account__form-row">
          <div className="edit-account__form-group">
            <label className="edit-account__label">
              Email <span className="edit-account__required">*</span>
            </label>
            <div className="edit-account__input-wrapper">
              <Mail className="edit-account__input-icon" size={20} />
              <input
                type="email"
                name="email"
                className="edit-account__input"
                placeholder="VD: user@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="edit-account__form-group">
            <label className="edit-account__label">
              Số điện thoại <span className="edit-account__required">*</span>
            </label>
            <div className="edit-account__input-wrapper">
              <Phone className="edit-account__input-icon" size={20} />
              <input
                type="tel"
                name="phone"
                className="edit-account__input"
                placeholder="VD: 0123456789"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Role and Status */}
        <div className="edit-account__form-row">
          <div className="edit-account__form-group">
            <label className="edit-account__label">
              Vai trò <span className="edit-account__required">*</span>
            </label>
            <select
              name="role"
              className="edit-account__select"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-account__form-group">
            <label className="edit-account__label">
              Trạng thái <span className="edit-account__required">*</span>
            </label>
            <select
              name="status"
              className="edit-account__select"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Password Section */}
        <div className="edit-account__section-title">
          Đổi mật khẩu (Tùy chọn)
        </div>

        <div className="edit-account__form-group edit-account__form-group--full">
          <label className="edit-account__label">
            Mật khẩu mới
          </label>
          <div className="edit-account__input-wrapper">
            <Lock className="edit-account__input-icon" size={20} />
            <input
              type="password"
              name="password"
              className="edit-account__input"
              placeholder="Để trống nếu không đổi mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <span className="edit-account__hint">Tối thiểu 6 ký tự</span>
        </div>

        <div className="edit-account__form-group edit-account__form-group--full">
          <label className="edit-account__label">
            Xác nhận mật khẩu
          </label>
          <div className="edit-account__input-wrapper">
            <Lock className="edit-account__input-icon" size={20} />
            <input
              type="password"
              name="confirmPassword"
              className="edit-account__input"
              placeholder="Nhập lại mật khẩu mới"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Agency Information Section - Only show when role is agency */}
        {formData.role === 'agency' && (
          <>
            <div className="edit-account__section-title edit-account__section-agency">
              <Building2 size={20} />
              Thông tin đại lý
            </div>

            <div className="edit-account__form-row">
              <div className="edit-account__form-group">
                <label className="edit-account__label">
                  Loại đại lý <span className="edit-account__required">*</span>
                </label>
                <select
                  name="agencyType"
                  className="edit-account__select"
                  value={formData.agencyType}
                  onChange={handleInputChange}
                  disabled
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', opacity: 0.7 }}
                  required
                >
                  <option value="1">Đại lý cấp 1</option>
                  <option value="2">Đại lý cấp 2</option>
                  <option value="3">Đại lý cấp 3</option>
                </select>
              </div>

              <div className="edit-account__form-group">
                <label className="edit-account__label">
                  Tên đại lý <span className="edit-account__required">*</span>
                </label>
                <div className="edit-account__input-wrapper">
                  <Building2 className="edit-account__input-icon" size={20} />
                  <input
                    type="text"
                    name="agencyName"
                    className="edit-account__input"
                    placeholder="Nhập tên đại lý"
                    value={formData.agencyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="edit-account__form-row">
              <div className="edit-account__form-group">
                <label className="edit-account__label">
                  Chủ đại lý <span className="edit-account__required">*</span>
                </label>
                <div className="edit-account__input-wrapper">
                  <Users className="edit-account__input-icon" size={20} />
                  <input
                    type="text"
                    name="agencyOwner"
                    className="edit-account__input"
                    placeholder="Nhập tên chủ đại lý"
                    value={formData.agencyOwner}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="edit-account__form-group">
                <label className="edit-account__label">
                  Hạn mức nợ (VNĐ)
                </label>
                <div className="edit-account__input-wrapper">
                  <CreditCard className="edit-account__input-icon" size={20} />
                  <input
                    type="number"
                    name="debtLimit"
                    className="edit-account__input"
                    placeholder="VD: 10000000"
                    value={formData.debtLimit}
                    onChange={handleInputChange}
                    disabled
                    style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="edit-account__form-group edit-account__form-group--full">
              <label className="edit-account__label">
                Địa chỉ <span className="edit-account__required">*</span>
              </label>
              <div className="edit-account__input-wrapper">
                <MapPin className="edit-account__input-icon" size={20} />
                <input
                  type="text"
                  name="agencyAddress"
                  className="edit-account__input"
                  placeholder="Nhập địa chỉ đại lý"
                  value={formData.agencyAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="edit-account__actions">
          <button
            type="button"
            className="edit-account__btn edit-account__btn--cancel"
            onClick={handleCancel}
          >
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>
          <button
            type="submit"
            className="edit-account__btn edit-account__btn--submit"
            disabled={submitting}
          >
            <CheckCircle2 size={20} />
            <span>{submitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
          </button>
        </div>
      </form>
        </>
      )}
    </div>
  )
}

export default EditAccount
