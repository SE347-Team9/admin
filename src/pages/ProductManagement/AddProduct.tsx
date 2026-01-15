import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Save, X, Tag, Banknote } from 'lucide-react'
import { toast } from 'react-toastify'
import './AddProduct.css'

interface FormErrors {
  code?: string
  name?: string
  category?: string
  unit?: string
  costPrice?: string
  sellingPrice?: string
}

const AddProduct = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    unit: '',
    costPrice: '',
    sellingPrice: '',
    description: '',
    status: 'active'
  })

  const [errors, setErrors] = useState<FormErrors>({})

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

    if (!formData.code.trim()) {
      newErrors.code = 'Vui lòng nhập mã sản phẩm'
    }

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

  const handleSubmit = (e: React.FormEvent) => {
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

    // TODO: Call API to create product
    toast.success('Thêm sản phẩm thành công!')
    navigate('/product-management')
  }

  const handleCancel = () => {
    navigate('/product-management')
  }

  return (
    <div className="add-product-page">
      <div className="add-product-header">
        <div className="header-icon-box">
          <Package size={36} />
        </div>
        <div className="header-text">
          <h1 className="add-product-title">Thêm sản phẩm mới</h1>
          <p className="add-product-subtitle">
            Thêm sản phẩm mới vào danh mục hệ thống
          </p>
        </div>
      </div>

      <div className="add-product-form-container">
        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3 className="section-title">
              <Tag size={20} />
              Thông tin cơ bản
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="code">Mã sản phẩm <span className="required">*</span></label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="VD: SP001"
                  className={errors.code ? 'input-error' : ''}
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
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
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <X size={20} />
              Hủy bỏ
            </button>
            <button type="submit" className="btn-submit">
              <Save size={20} />
              Thêm sản phẩm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
