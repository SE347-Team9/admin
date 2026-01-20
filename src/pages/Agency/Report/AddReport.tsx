import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import reportService from '../../../api/endpoints/reportService'
import './AddReport.css'

interface FormData {
  reportType: string
  reportPeriod: string
  startDate: string
  endDate: string
  notes: string
}

const AddReport = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    reportType: '',
    reportPeriod: '',
    startDate: '',
    endDate: '',
    notes: ''
  })

  const reportTypes = [
    { value: 'revenue', label: 'Báo cáo doanh số' },
    { value: 'debt', label: 'Báo cáo công nợ' }
  ]

  const reportPeriods = [
    { value: 'daily', label: 'Theo ngày' },
    { value: 'weekly', label: 'Theo tuần' },
    { value: 'monthly', label: 'Theo tháng' },
    { value: 'quarterly', label: 'Theo quý' },
    { value: 'yearly', label: 'Theo năm' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.reportType || !formData.reportPeriod || !formData.startDate || !formData.endDate) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc')
      return
    }

    try {
      // Parse dates to get month/year
      const startDate = new Date(formData.startDate)
      const month = startDate.getMonth() + 1
      const year = startDate.getFullYear()

      const reportData = {
        title: `Báo cáo ${formData.reportType === 'revenue' ? 'doanh số' : 'công nợ'} - ${formData.reportPeriod}`,
        type: formData.reportType,
        month,
        year,
        data: {
          period: formData.reportPeriod,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes
        }
      }

      const response = await reportService.create(reportData)
      
      if (response.success) {
        toast.success('Báo cáo đã được tạo thành công!')
        setTimeout(() => {
          navigate('/agency/reports')
        }, 1500)
      }
    } catch (error) {
      console.error('Error creating report:', error)
      toast.error('Không thể tạo báo cáo')
    }
  }

  const handleCancel = () => {
    navigate('/agency/reports')
  }

  return (
    <div className="add-report-page">
      <div className="add-report-container">
        {/* Back Button */}
        <button className="add-report__back-button" onClick={handleCancel}>
          <ArrowLeft size={20} />
          Quay lại
        </button>

        {/* Header */}
        <div className="add-report__header">
          <div className="add-report__header-icon">
            <FileText size={36} />
          </div>
          <div className="add-report__header-content">
            <h1 className="add-report__title">Lập báo cáo mới</h1>
            <p className="add-report__subtitle">
              Tạo một báo cáo mới để theo dõi các chỉ số kinh doanh của đại lý
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="add-report__form-card">
          <form onSubmit={handleSubmit} className="add-report__form">
            {/* Form Grid */}
            <div className="add-report__form-grid">
              {/* Report Type */}
              <div className="add-report__form-group">
                <label htmlFor="reportType" className="add-report__label">
                  Loại báo cáo <span className="add-report__required">*</span>
                </label>
                <select
                  id="reportType"
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleInputChange}
                  className="add-report__input"
                >
                  <option value="">Chọn loại báo cáo</option>
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Report Period */}
              <div className="add-report__form-group">
                <label htmlFor="reportPeriod" className="add-report__label">
                  Kỳ báo cáo <span className="add-report__required">*</span>
                </label>
                <select
                  id="reportPeriod"
                  name="reportPeriod"
                  value={formData.reportPeriod}
                  onChange={handleInputChange}
                  className="add-report__input"
                >
                  <option value="">Chọn kỳ báo cáo</option>
                  {reportPeriods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div className="add-report__form-group">
                <label htmlFor="startDate" className="add-report__label">
                  Ngày bắt đầu <span className="add-report__required">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="add-report__input"
                />
              </div>

              {/* End Date */}
              <div className="add-report__form-group">
                <label htmlFor="endDate" className="add-report__label">
                  Ngày kết thúc <span className="add-report__required">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="add-report__input"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="add-report__form-group add-report__form-group--full">
              <label htmlFor="notes" className="add-report__label">
                Ghi chú
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="add-report__textarea"
                placeholder="Ghi chú thêm về báo cáo..."
                rows={6}
              />
            </div>

            {/* Form Actions */}
            <div className="add-report__actions">
              <button
                type="button"
                className="add-report__btn add-report__btn--secondary"
                onClick={handleCancel}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="add-report__btn add-report__btn--primary"
              >
                Tạo báo cáo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddReport



