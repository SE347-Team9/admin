import { UserPlus, Save, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import './AddAccount.css'

const AddAccount = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!')
      return
    }

    // TODO: Call API to create account
    toast.success('Tạo tài khoản thành công!')
    navigate('/account-management')
  }

  const handleCancel = () => {
    navigate('/account-management')
  }

  return (
    <div className="add-account-page">
      <div className="add-account-header">
        <div className="header-icon-box">
          <UserPlus size={36} />
        </div>
        <div className="header-text">
          <h1 className="add-account-title">Thêm tài khoản mới</h1>
          <p className="add-account-subtitle">
            Tạo tài khoản mới cho người dùng trong hệ thống
          </p>
        </div>
      </div>

      <div className="add-account-form-container">
        <form onSubmit={handleSubmit} className="add-account-form">
          <div className="form-section">
            <h3 className="section-title">Thông tin đăng nhập</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username">Tên đăng nhập <span className="required">*</span></label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Vai trò <span className="required">*</span></label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Quản trị viên</option>
                  <option value="agency">Đại lý</option>
                  <option value="staff">Nhân viên</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu <span className="required">*</span></label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu <span className="required">*</span></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Thông tin cá nhân</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên <span className="required">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <span className="required">*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại <span className="required">*</span></label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Trạng thái <span className="required">*</span></label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                  <option value="pending">Chờ duyệt</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <X size={20} />
              Hủy bỏ
            </button>
            <button type="submit" className="btn-submit">
              <Save size={20} />
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAccount
