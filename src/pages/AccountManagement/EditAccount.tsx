import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Users, Mail, Phone, Lock, ArrowLeft, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { toast } from 'react-toastify'
import './EditAccount.css'

interface Account {
  id: string
  code: string
  username: string
  fullName: string
  email: string
  phone: string
  role: 'admin' | 'agency' | 'staff'
  status: 'active' | 'inactive' | 'pending'
}

const EditAccount = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock data - In real app, fetch from API based on id
  const [formData, setFormData] = useState({
    username: 'admin01',
    fullName: 'Nguyễn Văn A',
    email: 'admin01@example.com',
    phone: '0123456789',
    role: 'admin',
    status: 'active',
    password: '',
    confirmPassword: ''
  })

  const roles = [
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'agency', label: 'Đại lý' },
    { value: 'staff', label: 'Nhân viên' }
  ]

  const statuses = [
    { value: 'active', label: 'Hoạt động', icon: CheckCircle2 },
    { value: 'inactive', label: 'Ngừng hoạt động', icon: XCircle },
    { value: 'pending', label: 'Chờ duyệt', icon: Clock }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    navigate('/account-management')
  }

  const handleSubmit = (e: React.FormEvent) => {
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

    console.log('Form submitted:', formData)
    // TODO: Add API call to update account
    toast.success(`Cập nhật tài khoản ${formData.username} thành công!`)
    // After successful update, navigate back
    navigate('/account-management')
  }

  return (
    <div className="edit-account-page">
      {/* Header Section */}
      <div className="edit-account__header">
        <div className="edit-account__header-icon">
          <Users size={36} />
        </div>
        <div className="edit-account__header-text">
          <h1 className="edit-account__title">Chỉnh sửa tài khoản</h1>
          <p className="edit-account__subtitle">Cập nhật thông tin tài khoản người dùng</p>
        </div>
        <button className="edit-account__back-btn" onClick={handleCancel}>
          <ArrowLeft size={20} />
          <span>Quay lại danh sách</span>
        </button>
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

        {/* Action Buttons */}
        <div className="edit-account__actions">
          <button
            type="button"
            className="edit-account__btn edit-account__btn--cancel"
            onClick={handleCancel}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="edit-account__btn edit-account__btn--submit"
          >
            <CheckCircle2 size={20} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditAccount
