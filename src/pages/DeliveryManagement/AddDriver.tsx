import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Truck, 
  ArrowLeft, 
  Save,
  User,
  Phone,
  CreditCard,
  Car,
  MapPin
} from 'lucide-react'
import { toast } from 'react-toastify'
import { driverService } from '../../api/endpoints/driverService'
import './AddDriver.css'

const AddDriver = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    idCard: '',
    vehicleType: '',
    licensePlate: '',
    areas: [] as string[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const vehicleTypes = [
    { value: 'motorcycle', label: 'Xe máy' },
    { value: 'truck_small', label: 'Xe tải 1T' },
    { value: 'truck_medium', label: 'Xe tải 2.5T' },
    { value: 'truck_large', label: 'Xe tải 5T' }
  ]

  const availableAreas = [
    'Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 8', 
    'Quận 10', 'Quận 11', 'Tân Bình', 'Bình Thạnh', 'Gò Vấp',
    'Phú Nhuận', 'Thủ Đức', 'Bình Chánh', 'Hóc Môn', 'Củ Chi'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên tài xế'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!/^0\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ'
    }
    
    if (!formData.idCard.trim()) {
      newErrors.idCard = 'Vui lòng nhập số CCCD'
    } else if (!/^\d{12}$/.test(formData.idCard)) {
      newErrors.idCard = 'Số CCCD phải có 12 chữ số'
    }
    
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Vui lòng chọn loại phương tiện'
    }
    
    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'Vui lòng nhập biển số xe'
    }
    
    if (formData.areas.length === 0) {
      newErrors.areas = 'Vui lòng chọn ít nhất 1 khu vực phụ trách'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      try {
        setLoading(true)
        const response = await driverService.create({
          code: `TX${Date.now().toString().slice(-4)}`,
          fullName: formData.fullName,
          phone: formData.phone,
          idCard: formData.idCard,
          licensePlate: formData.licensePlate,
          status: 'active'
        })
        
        if (response.success) {
          toast.success('Thêm tài xế thành công!')
          navigate('/admin/delivery-management')
        }
      } catch (error: any) {
        console.error('Error creating driver:', error)
        const errorMsg = error.response?.data?.message || 'Không thể tạo tài xế'
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="add-driver-page">
      <div className="add-driver-header">
        <button className="btn-back" onClick={() => navigate('/admin/delivery-management')}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <div className="header-content">
          <div className="header-icon-box">
            <Truck size={36} />
          </div>
          <div className="header-text">
            <h1 className="add-driver-title">Thêm tài xế mới</h1>
            <p className="add-driver-subtitle">
              Điền thông tin để thêm tài xế giao hàng vào hệ thống
            </p>
          </div>
        </div>
      </div>

      <form className="add-driver-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">
            <User size={20} />
            Thông tin cá nhân
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Họ và tên <span className="required">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                className={`form-input ${errors.fullName ? 'error' : ''}`}
                placeholder="Nhập họ và tên tài xế"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={16} />
                Số điện thoại <span className="required">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="VD: 0901234567"
                value={formData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <CreditCard size={16} />
                Số CCCD <span className="required">*</span>
              </label>
              <input
                type="text"
                name="idCard"
                className={`form-input ${errors.idCard ? 'error' : ''}`}
                placeholder="Nhập 12 số CCCD"
                value={formData.idCard}
                onChange={handleInputChange}
              />
              {errors.idCard && <span className="error-message">{errors.idCard}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <Car size={20} />
            Thông tin phương tiện
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Loại phương tiện <span className="required">*</span>
              </label>
              <select
                name="vehicleType"
                className={`form-select ${errors.vehicleType ? 'error' : ''}`}
                value={formData.vehicleType}
                onChange={handleInputChange}
              >
                <option value="">-- Chọn loại phương tiện --</option>
                {vehicleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.vehicleType && <span className="error-message">{errors.vehicleType}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Biển số xe <span className="required">*</span>
              </label>
              <input
                type="text"
                name="licensePlate"
                className={`form-input ${errors.licensePlate ? 'error' : ''}`}
                placeholder="VD: 51C-12345"
                value={formData.licensePlate}
                onChange={handleInputChange}
              />
              {errors.licensePlate && <span className="error-message">{errors.licensePlate}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">
            <MapPin size={20} />
            Khu vực phụ trách <span className="required">*</span>
          </h3>
          {errors.areas && <span className="error-message">{errors.areas}</span>}
          
          <div className="areas-grid">
            {availableAreas.map(area => (
              <label key={area} className={`area-checkbox ${formData.areas.includes(area) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={formData.areas.includes(area)}
                  onChange={() => handleAreaToggle(area)}
                />
                <MapPin size={14} />
                {area}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/delivery-management')}>
            Hủy
          </button>
          <button type="submit" className="btn-submit">
            <Save size={20} />
            Thêm tài xế
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDriver
