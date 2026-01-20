import { UserPlus, Save, X, Building2, MapPin, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { accountService } from '../../api/endpoints/accountService'
import './AddAccount.css'

const AddAccount = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active',
    // Agency specific fields
    agencyType: '1',
    agencyName: '',
    agencyOwner: '',
    agencyAddress: '',
    debtLimit: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      setLoading(true)
      
      // Prepare data - include agency fields if role is agency
      const accountData: any = {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      };

      // Add agency-specific fields if creating an agency account
      if (formData.role === 'agency') {
        accountData.agencyName = formData.agencyName;
        accountData.agencyAddress = formData.agencyAddress;
      }

      const response = await accountService.create(accountData);

      if (response.success) {
        toast.success('Tạo tài khoản thành công!')
        navigate('/admin/account-management')
      }
    } catch (error: any) {
      console.error('Error creating account:', error)
      const errorMsg = error.response?.data?.message || 'Không thể tạo tài khoản'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/account-management')
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
                </select>
              </div>
            </div>
          </div>

          {/* Agency Information Section - Only show when role is agency */}
          {formData.role === 'agency' && (
            <div className="form-section form-section-agency">
              <h3 className="section-title">
                <Building2 size={20} />
                Thông tin đại lý
              </h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="agencyType">Loại đại lý <span className="required">*</span></label>
                  <select
                    id="agencyType"
                    name="agencyType"
                    value={formData.agencyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="1">Đại lý cấp 1</option>
                    <option value="2">Đại lý cấp 2</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="agencyName">Tên đại lý <span className="required">*</span></label>
                  <input
                    type="text"
                    id="agencyName"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    placeholder="Nhập tên đại lý"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="agencyOwner">Chủ đại lý <span className="required">*</span></label>
                  <input
                    type="text"
                    id="agencyOwner"
                    name="agencyOwner"
                    value={formData.agencyOwner}
                    onChange={handleChange}
                    placeholder="Nhập tên chủ đại lý"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="debtLimit">
                    <CreditCard size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Hạn mức nợ (VNĐ)
                  </label>
                  <input
                    type="number"
                    id="debtLimit"
                    name="debtLimit"
                    value={formData.debtLimit}
                    onChange={handleChange}
                    placeholder="VD: 10000000"
                    min="0"
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="agencyAddress">
                    <MapPin size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Địa chỉ <span className="required">*</span>
                  </label>
                  <textarea
                    id="agencyAddress"
                    name="agencyAddress"
                    value={formData.agencyAddress}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ đại lý"
                    rows={2}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <X size={20} />
              Hủy bỏ
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              <Save size={20} />
              {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAccount
