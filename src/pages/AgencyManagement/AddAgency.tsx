import { Store, Save, X, MapPin, User, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import './AddAgency.css'

const AddAgency = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    owner: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    city: '',
    agencyType: 'level_1',
    debtLimit: '',
    status: 'active'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.code || !formData.name || !formData.owner || !formData.phone || !formData.address) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc!')
      return
    }

    const phoneRegex = /^[0-9]{10,11}$/
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Số điện thoại không hợp lệ!')
      return
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Email không hợp lệ!')
        return
      }
    }

    // TODO: Call API to create agency
    toast.success('Thêm đại lý thành công!')
    navigate('/agency-management')
  }

  const handleCancel = () => {
    navigate('/agency-management')
  }

  return (
    <div className="add-agency-page">
      <div className="add-agency-header">
        <div className="header-icon-box">
          <Store size={36} />
        </div>
        <div className="header-text">
          <h1 className="add-agency-title">Thêm đại lý mới</h1>
          <p className="add-agency-subtitle">
            Tạo đại lý mới và thiết lập thông tin chi tiết
          </p>
        </div>
      </div>

      <div className="add-agency-form-container">
        <form onSubmit={handleSubmit} className="add-agency-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3 className="section-title">
              <Store size={20} />
              Thông tin cơ bản
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="code">Mã đại lý <span className="required">*</span></label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Nhập mã đại lý (VD: DL001)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Tên đại lý <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên đại lý"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="agencyType">Loại đại lý <span className="required">*</span></label>
                <select
                  id="agencyType"
                  name="agencyType"
                  value={formData.agencyType}
                  onChange={handleChange}
                  required
                >
                  <option value="level_1">Đại lý cấp 1</option>
                  <option value="level_2">Đại lý cấp 2</option>
                </select>
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
                  <option value="inactive">Ngưng hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={20} />
              Thông tin liên hệ
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="owner">Chủ đại lý <span className="required">*</span></label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  placeholder="Nhập tên chủ đại lý"
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
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="form-section">
            <h3 className="section-title">
              <MapPin size={20} />
              Địa chỉ
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="address">Địa chỉ <span className="required">*</span></label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ chi tiết"
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="district">Quận/Huyện <span className="required">*</span></label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Nhập quận/huyện"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Tỉnh/Thành phố <span className="required">*</span></label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Nhập tỉnh/thành phố"
                  required
                />
              </div>
            </div>
          </div>

          {/* Thông tin tài chính */}
          <div className="form-section">
            <h3 className="section-title">
              <CreditCard size={20} />
              Thông tin tài chính
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="debtLimit">Hạn mức nợ (VNĐ)</label>
                <input
                  type="number"
                  id="debtLimit"
                  name="debtLimit"
                  value={formData.debtLimit}
                  onChange={handleChange}
                  placeholder="Nhập hạn mức nợ"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <X size={20} />
              Hủy bỏ
            </button>
            <button type="submit" className="btn-submit">
              <Save size={20} />
              Thêm đại lý
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAgency
