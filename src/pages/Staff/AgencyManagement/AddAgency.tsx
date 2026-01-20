import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Building2, User, MapPin, Phone, Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { agencyService } from '../../../api/endpoints/agencyService'
import './AddAgency.css'

const AddAgency = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    representative: '',
    agencyType: '',
    district: '',
    address: '',
    phone: '',
    email: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCancel = () => {
    navigate('/staff/agency-management')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await agencyService.create({
        code: `DL${Date.now().toString().slice(-4)}`,
        name: formData.name,
        address: `${formData.address}, ${formData.district}`,
        phone: formData.phone,
        email: formData.email,
        status: 'active'
      })
      if (response.success) {
        toast.success('Thêm đại lý thành công!')
        navigate('/staff/agency-management')
      }
    } catch (error: any) {
      console.error('Error creating agency:', error)
      toast.error('Không thể tạo đại lý')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-agency-page">
      {/* Header Section */}
      <div className="add-agency__header">
        <div className="add-agency__header-icon">
          <UserPlus size={36} />
        </div>
        <div className="add-agency__header-text">
          <h1 className="add-agency__title">Thêm Đại Lý Mới</h1>
          <p className="add-agency__subtitle">Điền thông tin dễ tạo hồ sơ cho một đại lý</p>
        </div>
        <button className="add-agency__back-btn" onClick={handleCancel}>
          <ArrowLeft size={20} />
          <span>Quay lại danh sách</span>
        </button>
      </div>

      {/* Form Section */}
      <form className="add-agency__form-card" onSubmit={handleSubmit}>
        {/* Agency Name */}
        <div className="add-agency__form-group add-agency__form-group--full">
          <label className="add-agency__label">
            Tên đại lý <span className="add-agency__required">*</span>
          </label>
          <div className="add-agency__input-wrapper">
            <Building2 className="add-agency__input-icon" size={20} />
            <input
              type="text"
              name="name"
              className="add-agency__input"
              placeholder="VD: Công ty TNHH An Khang"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Representative and Date */}
        <div className="add-agency__form-row">
          <div className="add-agency__form-group">
            <label className="add-agency__label">
              Người đại diện <span className="add-agency__required">*</span>
            </label>
            <div className="add-agency__input-wrapper">
              <User className="add-agency__input-icon" size={20} />
              <input
                type="text"
                name="representative"
                className="add-agency__input"
                placeholder="VD: Nguyễn Văn A"
                value={formData.representative}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="add-agency__form-group">
            <label className="add-agency__label">
              Ngày tiếp nhận <span className="add-agency__required">*</span>
            </label>
            <div className="add-agency__input-wrapper">
              <input
                type="date"
                name="receiveDate"
                className="add-agency__input"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
        </div>

        {/* Classification Section */}
        <div className="add-agency__section-title">
          Phân loại & Khu vực
        </div>

        <div className="add-agency__form-row">
          <div className="add-agency__form-group">
            <label className="add-agency__label">
              Loại đại lý <span className="add-agency__required">*</span>
            </label>
            <div className="add-agency__input-wrapper">
              <select
                name="agencyType"
                className="add-agency__select"
                value={formData.agencyType}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn loại đại lý --</option>
                <option value="type1">Loại 1</option>
                <option value="type2">Loại 2</option>
              </select>
            </div>
          </div>

          <div className="add-agency__form-group">
            <label className="add-agency__label">
              Quận / Huyện <span className="add-agency__required">*</span>
            </label>
            <div className="add-agency__input-wrapper">
              <select
                name="district"
                className="add-agency__select"
                value={formData.district}
                onChange={handleInputChange}
                required
              >
                <option value="">-- Chọn quận/huyện --</option>
                <option value="district1">Quận 1</option>
                <option value="district2">Quận 2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="add-agency__section-title">
          Thông tin liên hệ
        </div>

        <div className="add-agency__form-group add-agency__form-group--full">
          <label className="add-agency__label">
            Địa chỉ chi tiết <span className="add-agency__required">*</span>
          </label>
          <div className="add-agency__input-wrapper">
            <MapPin className="add-agency__input-icon" size={20} />
            <input
              type="text"
              name="address"
              className="add-agency__input"
              placeholder="VD: 123 Võ Văn Tần, Phường 6"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="add-agency__form-row">
          <div className="add-agency__form-group">
            <label className="add-agency__label">
              Số điện thoại <span className="add-agency__required">*</span>
            </label>
            <div className="add-agency__input-wrapper">
              <Phone className="add-agency__input-icon" size={20} />
              <input
                type="tel"
                name="phone"
                className="add-agency__input"
                placeholder="VD: 0901234567"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="add-agency__form-group">
            <label className="add-agency__label">
              Email <span className="add-agency__required">*</span>
            </label>
            <div className="add-agency__input-wrapper">
              <Mail className="add-agency__input-icon" size={20} />
              <input
                type="email"
                name="email"
                className="add-agency__input"
                placeholder="VD: daily.ankhang@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="add-agency__actions">
          <button
            type="button"
            className="add-agency__btn add-agency__btn--cancel"
            onClick={handleCancel}
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            className="add-agency__btn add-agency__btn--submit"
          >
            <UserPlus size={20} />
            <span>Thêm Đại Lý</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddAgency



