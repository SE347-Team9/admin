import { Edit, ArrowLeft, Check } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import './EditRegulation.css'

const EditRegulation = () => {
  const navigate = useNavigate()
  useParams()

  // Mock data - should fetch from API based on id
  const initialData = {
    code: 'max_debt_level_1',
    value: 100000000,
    description: 'Mức nợ tối đa cấp độ 1',
    notes: 'Áp dụng cho các đại lý mới, thời gian khấu hao 30 ngày'
  }

  const [formData, setFormData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseInt(value) || 0 : value
    }))
  }

  const handleCancel = () => {
    navigate('/regulations')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    if (!formData.value || formData.value <= 0) {
      toast.error('Vui lòng nhập giá trị hợp lệ (phải lớn hơn 0)')
      return
    }

    if (!formData.notes.trim()) {
      toast.error('Vui lòng nhập ghi chú')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Here would be the API call to update regulation
      toast.success('Cập nhật quy định thành công!')

      setTimeout(() => {
        navigate('/regulations')
      }, 1500)
    } catch (error) {
      toast.error('Cập nhật quy định thất bại')
      setIsLoading(false)
    }
  }

  return (
    <div className="edit-regulation-page">
      <div className="edit-regulation__header">
        <div className="edit-regulation__header-icon">
          <Edit size={40} />
        </div>
        <div className="edit-regulation__header-text">
          <h1 className="edit-regulation__title">Chỉnh sửa quy định</h1>
          <p className="edit-regulation__subtitle">
            Cập nhật thông tin quy định trong hệ thống
          </p>
        </div>
      </div>

      <div className="edit-regulation__content">
        <form className="edit-regulation__form" onSubmit={handleSubmit}>
          {/* Section: Basic Information */}
          <div className="edit-regulation__form-section">
            <h3 className="edit-regulation__section-title">Thông tin cơ bản</h3>

            <div className="edit-regulation__form-group">
              <label htmlFor="code">Mã quy định:</label>
              <input
                id="code"
                type="text"
                value={formData.code}
                disabled
                className="edit-regulation__form-input edit-regulation__form-input--disabled"
                placeholder="Mã quy định"
              />
              <small className="edit-regulation__form-hint">Mã được tạo tự động (không thể chỉnh sửa)</small>
            </div>

            <div className="edit-regulation__form-group">
              <label htmlFor="description">Mô tả:</label>
              <input
                id="description"
                type="text"
                value={formData.description}
                disabled
                className="edit-regulation__form-input edit-regulation__form-input--disabled"
                placeholder="Mô tả quy định"
              />
              <small className="edit-regulation__form-hint">Thông tin tham khảo (không thể chỉnh sửa)</small>
            </div>

            <div className="edit-regulation__form-group">
              <label htmlFor="value">
                Giá trị: <span className="edit-regulation__required">*</span>
              </label>
              <input
                id="value"
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                className="edit-regulation__form-input"
                placeholder="Nhập giá trị quy định"
                required
                min="1"
              />
              <small className="edit-regulation__form-hint">Giá trị phải lớn hơn 0</small>
            </div>

            <div className="edit-regulation__form-group">
              <label htmlFor="notes">
                Ghi chú: <span className="edit-regulation__required">*</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="edit-regulation__form-textarea"
                placeholder="Nhập ghi chú hoặc hướng dẫn sử dụng quy định này"
                rows={6}
                required
              />
              <small className="edit-regulation__form-hint">Tối đa 500 ký tự</small>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="edit-regulation__form-actions">
            <button
              type="button"
              className="edit-regulation__btn edit-regulation__btn--back"
              onClick={handleCancel}
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
              Quay lại danh sách
            </button>
            <button
              type="submit"
              className="edit-regulation__btn edit-regulation__btn--submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="edit-regulation__spinner"></div>
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

export default EditRegulation
