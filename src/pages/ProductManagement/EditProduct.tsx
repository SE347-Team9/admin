import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Package, Save, ArrowLeft, Tag, Banknote } from 'lucide-react'
import { toast } from 'react-toastify'
import './EditProduct.css'

interface FormErrors {
  name?: string
  category?: string
  unit?: string
  costPrice?: string
  sellingPrice?: string
}

const EditProduct = () => {
  const navigate = useNavigate()
  useParams() // Get product ID from URL

  // Mock data - should fetch from API based on id
  const [formData, setFormData] = useState({
    code: 'SP001',
    name: 'Bia Hà Nội',
    category: 'Đồ uống có cồn',
    unit: 'Thùng',
    costPrice: '200000',
    sellingPrice: '250000',
    description: 'Bia Hà Nội là thương hiệu bia nổi tiếng của Việt Nam.',
    status: 'active'
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    'Đồ uống có cồn',
    'Nước giải khát',
    'Sữa & Sản phẩm từ sữa',
    'Bánh kẹo',
    'Lương thực',
    'Gia vị',
    'Đồ hộp',
    'Hóa phẩm',
    'Khác'
  ]

  const units = [
    'Thùng',
    'Lốc',
    'Hộp',
    'Gói',
    'Chai',
    'Lon',
    'Kg',
    'Túi',
    'Cái'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên sản phẩm'
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục'
    }

    if (!formData.unit) {
      newErrors.unit = 'Vui lòng chọn đơn vị tính'
    }

    if (!formData.costPrice || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = 'Vui lòng nhập giá nhập hợp lệ'
    }

    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
      newErrors.sellingPrice = 'Vui lòng nhập giá bán hợp lệ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    const costPrice = parseFloat(formData.costPrice)
    const sellingPrice = parseFloat(formData.sellingPrice)

    if (sellingPrice < costPrice) {
      toast.warning('Cảnh báo: Giá bán thấp hơn giá nhập!')
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.success('Cập nhật sản phẩm thành công!')
      navigate('/product-management')
    } catch {
      toast.error('Cập nhật sản phẩm thất bại!')
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/product-management')
  }

  return (
    <div className="edit-product-page">
      <div className="edit-product-header">
        <div className="header-icon-box">
          <Package size={36} />
        </div>
        <div className="header-text">
          <h1 className="edit-product-title">Chỉnh sửa sản phẩm</h1>
          <p className="edit-product-subtitle">
            Cập nhật thông tin sản phẩm {formData.code}
          </p>
        </div>
      </div>

      <div className="edit-product-form-container">
        <form onSubmit={handleSubmit} className="edit-product-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3 className="section-title">
              <Tag size={20} />
              Thông tin cơ bản
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="code">Mã sản phẩm</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  disabled
                  className="input-disabled"
                />
                <small className="form-hint">Mã sản phẩm không thể thay đổi</small>
              </div>

              <div className="form-group">
                <label htmlFor="name">Tên sản phẩm <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên sản phẩm"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Danh mục <span className="required">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'input-error' : ''}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="unit">Đơn vị tính <span className="required">*</span></label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className={errors.unit ? 'input-error' : ''}
                >
                  <option value="">Chọn đơn vị</option>
                  {units.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                {errors.unit && <span className="error-message">{errors.unit}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="status">Trạng thái <span className="required">*</span></label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Đang kinh doanh</option>
                  <option value="inactive">Ngừng kinh doanh</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thông tin giá */}
          <div className="form-section">
            <h3 className="section-title">
              <Banknote size={20} />
              Thông tin giá
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="costPrice">Giá nhập (VNĐ) <span className="required">*</span></label>
                <input
                  type="number"
                  id="costPrice"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="Nhập giá nhập"
                  min="0"
                  className={errors.costPrice ? 'input-error' : ''}
                />
                {errors.costPrice && <span className="error-message">{errors.costPrice}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="sellingPrice">Giá bán (VNĐ) <span className="required">*</span></label>
                <input
                  type="number"
                  id="sellingPrice"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="Nhập giá bán"
                  min="0"
                  className={errors.sellingPrice ? 'input-error' : ''}
                />
                {errors.sellingPrice && <span className="error-message">{errors.sellingPrice}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="description">Mô tả sản phẩm</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả sản phẩm (không bắt buộc)"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isLoading}>
              <ArrowLeft size={20} />
              Quay lại
            </button>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
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

export default EditProduct
