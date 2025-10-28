import { Edit, ArrowLeft, Check } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import './EditAgency.css'

const EditAgency = () => {
  const navigate = useNavigate()
  useParams()

  // Mock data - should fetch from API based on id
  const initialData = {
    code: 'DL001',
    name: 'Đại lý Nghĩa',
    address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
    phone: '02232434242',
    email: 'nghiaagency@gmail.com',
    status: 'active'
  }

  const [formData, setFormData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    navigate('/agency-management')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên đại lý')
      return
    }

    if (!formData.address.trim()) {
      toast.error('Vui lòng nhập địa chỉ')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Vui lòng nhập email')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Here would be the API call to update agency
      toast.success('Cập nhật thông tin đại lý thành công!')

      setTimeout(() => {
        navigate('/agency-management')
      }, 1500)
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại')
      setIsLoading(false)
    }
  }

  return (
    <div className="edit-agency-page">
      <div className="edit-agency__header">
        <div className="edit-agency__header-icon">
          <Edit size={40} />
        </div>
        <div className="edit-agency__header-text">
          <h1 className="edit-agency__title">Chỉnh sửa đại lý</h1>
          <p className="edit-agency__subtitle">
            Cập nhật thông tin của đại lý trong hệ thống
          </p>
        </div>
      </div>

      <div className="edit-agency__content">
        <form className="edit-agency__form" onSubmit={handleSubmit}>
          {/* Section 1: Basic Information */}
          <div className="edit-agency__form-section">
            <h3 className="edit-agency__section-title">Thông tin cơ bản</h3>

            <div className="edit-agency__form-group">
              <label htmlFor="code">Mã đại lý:</label>
              <input
                id="code"
                type="text"
                value={formData.code}
                disabled
                className="edit-agency__form-input edit-agency__form-input--disabled"
                placeholder="Mã đại lý sẽ được tự động ghi nhận"
              />
              <small className="edit-agency__form-hint">Mã được tạo tự động (không thể chỉnh sửa)</small>
            </div>

            <div className="edit-agency__form-group">
              <label htmlFor="name">
                Tên đại lý: <span className="edit-agency__required">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="edit-agency__form-input"
                placeholder="Nhập tên đại lý"
                required
              />
            </div>

            <div className="edit-agency__form-group">
              <label htmlFor="address">
                Địa chỉ: <span className="edit-agency__required">*</span>
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="edit-agency__form-input"
                placeholder="Nhập địa chỉ đầy đủ"
                required
              />
            </div>

            <div className="edit-agency__form-row">
              <div className="edit-agency__form-group">
                <label htmlFor="phone">
                  Số điện thoại: <span className="edit-agency__required">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="edit-agency__form-input"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="edit-agency__form-group">
                <label htmlFor="email">
                  Email: <span className="edit-agency__required">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="edit-agency__form-input"
                  placeholder="Nhập email"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Status */}
          <div className="edit-agency__form-section">
            <h3 className="edit-agency__section-title">Trạng thái</h3>

            <div className="edit-agency__form-group">
              <label htmlFor="status">
                Trạng thái: <span className="edit-agency__required">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="edit-agency__form-select"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="edit-agency__form-actions">
            <button
              type="button"
              className="edit-agency__btn edit-agency__btn--back"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
              Quay lại danh sách
            </button>
            <button
              type="submit"
              className="edit-agency__btn edit-agency__btn--submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="edit-agency__spinner"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAgency
