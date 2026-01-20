import { Edit, ArrowLeft, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { agencyService } from '../../api/endpoints/agencyService'
import './EditAgency.css'

const EditAgency = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Helper function to format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const initialData = {
    code: '',
    name: '',
    address: '',
    phone: '',
    email: '',
    location: '',
    status: 'active'
  }

  const [formData, setFormData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Fetch agency data on mount
  useEffect(() => {
    if (id) {
      fetchAgency()
    }
  }, [id])

  const fetchAgency = async () => {
    try {
      setFetchLoading(true)
      const response = await agencyService.getById(id!)
      if (response.success) {
        setFormData({
          code: response.data.code,
          name: response.data.name,
          address: response.data.address,
          phone: response.data.phone || '',
          email: response.data.email || '',
          location: response.data.location || '',
          status: response.data.status
        })
      }
    } catch (error: any) {
      console.error('Error fetching agency:', error)
      toast.error('Không thể tải thông tin đại lý')
      navigate('/admin/agency-management')
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    navigate('/admin/agency-management')
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

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Email không hợp lệ')
        return
      }
    }

    setIsLoading(true)

    try {
      const response = await agencyService.update(id!, formData)

      if (response.success) {
        toast.success('Cập nhật thông tin đại lý thành công!')
        setTimeout(() => {
          navigate('/admin/agency-management')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Error updating agency:', error)
      const errorMsg = error.response?.data?.message || 'Cập nhật thông tin thất bại'
      toast.error(errorMsg)
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

          {/* Section 2: Agency Level & Finance */}
          <div className="edit-agency__form-section">
            <h3 className="edit-agency__section-title">Cấp đại lý & Tài chính</h3>

            <div className="edit-agency__form-row">
              <div className="edit-agency__form-group">
                <label htmlFor="level">
                  Cấp đại lý: <span className="edit-agency__required">*</span>
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="edit-agency__form-select"
                >
                  <option value="1">Cấp 1</option>
                  <option value="2">Cấp 2</option>
                </select>
              </div>

              <div className="edit-agency__form-group">
                <label htmlFor="debtLimit">
                  Hạn mức công nợ: <span className="edit-agency__required">*</span>
                </label>
                <input
                  id="debtLimit"
                  type="text"
                  name="debtLimit"
                  value={formatCurrency(formData.debtLimit)}
                  className="edit-agency__form-input"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    setFormData(prev => ({ ...prev, debtLimit: Number(value) }))
                  }}
                  placeholder="Nhập hạn mức công nợ"
                  required
                />
              </div>
            </div>

            <div className="edit-agency__form-row">
              <div className="edit-agency__form-group">
                <label>Doanh số nhập hàng:</label>
                <div className="edit-agency__info-display edit-agency__info-display--sales">
                  {formatCurrency(formData.totalSales)}đ
                </div>
                <small className="edit-agency__form-hint">Thông tin chỉ đọc</small>
              </div>

              <div className="edit-agency__form-group">
                <label>Công nợ hiện tại:</label>
                <div className="edit-agency__info-display edit-agency__info-display--debt">
                  {formatCurrency(formData.debt)}đ / {formatCurrency(formData.debtLimit)}đ
                </div>
                <small className="edit-agency__form-hint">Thông tin chỉ đọc</small>
              </div>
            </div>
          </div>

          {/* Section 3: Dates */}
          <div className="edit-agency__form-section">
            <h3 className="edit-agency__section-title">Thời gian</h3>

            <div className="edit-agency__form-row">
              <div className="edit-agency__form-group">
                <label>Ngày tạo:</label>
                <div className="edit-agency__info-display">
                  {formData.createdAt}
                </div>
              </div>

              <div className="edit-agency__form-group">
                <label>Cập nhật lần cuối:</label>
                <div className="edit-agency__info-display">
                  {formData.updatedAt}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Status */}
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
                <option value="inactive">Ngừng hoạt động</option>
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
