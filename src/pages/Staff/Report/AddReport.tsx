import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ArrowLeft, Plus, Trash2, ChevronDown, ClipboardList, Package } from 'lucide-react'
import { toast } from 'react-toastify'
import reportService from '../../../api/endpoints/reportService'
import './AddReport.css'

interface ImportDetail {
  id: string
  product: string
  unit: string
  quantity: number
  unitPrice: number
}

interface DistributionDetail {
  id: string
  agency: string
  product: string
  quantity: number
  unitPrice: number
}

interface DebtDetail {
  id: string
  agency: string
  totalDue: number
  collected: number
}

const AddReport = () => {
  const navigate = useNavigate()
  
  // Generate report code - commented out unused function
  /*
  const generateReportCode = () => {
    const num = Math.floor(Math.random() * 10000).toString().padStart(3, '0')
    return `BC${num}`
  }
  */

  // Form state
  const [reportCode] = useState('BC1')
  const [reportType, setReportType] = useState<'import' | 'distribution' | 'debt'>('import')
  const [period, setPeriod] = useState('')
  
  // Import report filters
  const [manufacturerFilter, setManufacturerFilter] = useState('all')
  const warehouseFilter = 'all'; // Simplified unused state
  const [importDetails, setImportDetails] = useState<ImportDetail[]>([
    {
      id: '1',
      product: 'Sản phẩm A',
      unit: 'kg',
      quantity: 100,
      unitPrice: 450000
    }
  ])

  // Distribution report filters
  const [agencyFilterDist, setAgencyFilterDist] = useState('all')
  // const warehouseFilterDist = 'all'; // Simplified unused state
  const [distributionDetails, setDistributionDetails] = useState<DistributionDetail[]>([
    {
      id: '1',
      agency: 'Đại lý A',
      product: 'Sản phẩm B',
      quantity: 80,
      unitPrice: 400000
    }
  ])

  // Debt report filters
  const [agencyFilterDebt, setAgencyFilterDebt] = useState('all')
  const statusFilterDebt = 'all'; // Simplified unused state
  const [debtDetails, setDebtDetails] = useState<DebtDetail[]>([
    {
      id: '1',
      agency: 'Đại lý A',
      totalDue: 24060000,
      collected: 0
    }
  ])

  // Get current date
  const currentDate = new Date().toLocaleDateString('vi-VN')

  // Calculate totals
  const importTotal = useMemo(() => {
    return importDetails.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }, [importDetails])

  const distributionTotal = useMemo(() => {
    return distributionDetails.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }, [distributionDetails])

  const debtTotal = useMemo(() => {
    return debtDetails.reduce((sum, item) => sum + (item.totalDue - item.collected), 0)
  }, [debtDetails])

  // Add row handlers
  const addImportRow = () => {
    setImportDetails([
      ...importDetails,
      {
        id: Date.now().toString(),
        product: '',
        unit: '',
        quantity: 0,
        unitPrice: 0
      }
    ])
  }

  const addDistributionRow = () => {
    setDistributionDetails([
      ...distributionDetails,
      {
        id: Date.now().toString(),
        agency: '',
        product: '',
        quantity: 0,
        unitPrice: 0
      }
    ])
  }

  const addDebtRow = () => {
    setDebtDetails([
      ...debtDetails,
      {
        id: Date.now().toString(),
        agency: '',
        totalDue: 0,
        collected: 0
      }
    ])
  }

  // Delete row handlers
  const deleteImportRow = (id: string) => {
    setImportDetails(importDetails.filter(item => item.id !== id))
  }

  const deleteDistributionRow = (id: string) => {
    setDistributionDetails(distributionDetails.filter(item => item.id !== id))
  }

  const deleteDebtRow = (id: string) => {
    setDebtDetails(debtDetails.filter(item => item.id !== id))
  }

  // Update handlers
  const updateImportDetail = (id: string, field: keyof ImportDetail, value: any) => {
    setImportDetails(importDetails.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const updateDistributionDetail = (id: string, field: keyof DistributionDetail, value: any) => {
    setDistributionDetails(distributionDetails.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const updateDebtDetail = (id: string, field: keyof DebtDetail, value: any) => {
    setDebtDetails(debtDetails.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!period) {
      toast.error('Vui lòng chọn kỳ báo cáo')
      return
    }

    if (reportType === 'import' && importDetails.length === 0) {
      toast.error('Vui lòng thêm ít nhất một mục nhập kho')
      return
    }

    if (reportType === 'distribution' && distributionDetails.length === 0) {
      toast.error('Vui lòng thêm ít nhất một mục phân phối')
      return
    }

    if (reportType === 'debt' && debtDetails.length === 0) {
      toast.error('Vui lòng thêm ít nhất một mục công nợ')
      return
    }

    try {
      // Parse period (format: MM/YYYY)
      const [month, year] = period.split('/').map(Number)
      
      // Prepare report data
      const reportData = {
        title: `Báo cáo ${reportType === 'import' ? 'Nhập kho' : reportType === 'distribution' ? 'Phân phối' : 'Công nợ'} ${period}`,
        type: reportType,
        month,
        year,
        data: {
          importDetails: reportType === 'import' ? importDetails : undefined,
          distributionDetails: reportType === 'distribution' ? distributionDetails : undefined,
          debtDetails: reportType === 'debt' ? debtDetails : undefined,
          filters: {
            manufacturer: manufacturerFilter,
            warehouse: warehouseFilter,
            agency: reportType === 'distribution' ? agencyFilterDist : reportType === 'debt' ? agencyFilterDebt : undefined,
            status: reportType === 'debt' ? statusFilterDebt : undefined
          }
        }
      }

      const response = await reportService.create(reportData)
      
      if (response.success) {
        toast.success('Tạo báo cáo thành công!')
        setTimeout(() => {
          navigate('/staff/reports')
        }, 1500)
      }
    } catch (error) {
      console.error('Error creating report:', error)
      toast.error('Không thể tạo báo cáo')
    }
  }

  return (
    <div className="add-report-page">
      {/* Page Header */}
      <div className="add-report-header">
        <div className="header-icon-box">
          <FileText size={36} />
        </div>
        <div className="header-text">
          <h1 className="add-report-title">Lập báo cáo</h1>
          <p className="add-report-subtitle">
            Tạo báo cáo nhập kho, phân phối hoặc công nợ
          </p>
        </div>
        <button
          className="btn-back"
          onClick={() => navigate('/staff/reports')}
          title="Quay lại"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="add-report-form">
        {/* Common Section */}
        <div className="form-section">
          <h2 className="section-title">
            <span className="section-icon">
              <ClipboardList size={18} />
            </span>
            Thông tin báo cáo
          </h2>
          
          <div className="form-grid">
            {/* Report Code */}
            <div className="form-group">
              <label className="form-label">Mã báo cáo</label>
              <input
                type="text"
                value={reportCode}
                disabled
                className="form-input form-input-disabled"
              />
            </div>

            {/* Report Type */}
            <div className="form-group">
              <label className="form-label">
                Loại báo cáo <span className="required">*</span>
              </label>
              <div className="custom-select">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="form-select"
                >
                  <option value="import">Nhập kho</option>
                  <option value="distribution">Phân phối</option>
                  <option value="debt">Công nợ</option>
                </select>
                <ChevronDown size={20} className="select-icon" />
              </div>
            </div>

            {/* Period */}
            <div className="form-group">
              <label className="form-label">
                Kỳ báo cáo <span className="required">*</span>
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="MM/YY"
                className="form-input"
              />
            </div>

            {/* Staff Name - Auto */}
            <div className="form-group">
              <label className="form-label">Staff lập báo cáo</label>
              <input
                type="text"
                value="Nguyễn Văn A"
                disabled
                className="form-input form-input-disabled"
              />
            </div>

            {/* Created Date - Auto */}
            <div className="form-group">
              <label className="form-label">Ngày lập</label>
              <input
                type="text"
                value={currentDate}
                disabled
                className="form-input form-input-disabled"
              />
            </div>
          </div>
        </div>

        {/* Import Report Section */}
        {reportType === 'import' && (
          <div className="form-section">
            <h2 className="section-title">
              <span className="section-icon">
                <Package size={18} />
              </span>
              Báo cáo nhập kho
            </h2>
            
            {/* Filters */}
            <div className="filters-grid">
              <div className="form-group">
                <label className="form-label">Nhà sản xuất</label>
                <div className="custom-select">
                  <select
                    value={manufacturerFilter}
                    onChange={(e) => setManufacturerFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Tất cả</option>
                    <option value="nsx1">Nhà sản xuất 1</option>
                    <option value="nsx2">Nhà sản xuất 2</option>
                  </select>
                  <ChevronDown size={20} className="select-icon" />
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="table-section">
              <div className="table-header-controls">
                <h3 className="table-title">Chi tiết nhập kho</h3>
                <button
                  type="button"
                  onClick={addImportRow}
                  className="btn-add-row"
                >
                  <Plus size={18} />
                  Thêm dòng
                </button>
              </div>

              <div className="table-container">
                <table className="report-detail-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn vị</th>
                      <th>SL nhập</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importDetails.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) => updateImportDetail(item.id, 'product', e.target.value)}
                            className="table-input"
                            placeholder="Nhập sản phẩm"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => updateImportDetail(item.id, 'unit', e.target.value)}
                            className="table-input"
                            placeholder="Đơn vị"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateImportDetail(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="table-input"
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateImportDetail(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="table-input"
                            placeholder="0"
                          />
                        </td>
                        <td className="table-amount">
                          {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="table-action">
                          <button
                            type="button"
                            onClick={() => deleteImportRow(item.id)}
                            className="btn-delete"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="summary-section">
                <div className="summary-item highlight">
                  <span>Tổng giá trị nhập kho:</span>
                  <strong>{importTotal.toLocaleString('vi-VN')} đ</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Distribution Report Section */}
        {reportType === 'distribution' && (
          <div className="form-section">
            <h2 className="section-title">🚚 Báo cáo phân phối</h2>
            
            {/* Filters */}
            <div className="filters-grid">
              <div className="form-group">
                <label className="form-label">Đại lý</label>
                <div className="custom-select">
                  <select
                    value={agencyFilterDist}
                    onChange={(e) => setAgencyFilterDist(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Tất cả</option>
                    <option value="agency1">Đại lý A</option>
                    <option value="agency2">Đại lý B</option>
                  </select>
                  <ChevronDown size={20} className="select-icon" />
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="table-section">
              <div className="table-header-controls">
                <h3 className="table-title">Chi tiết phân phối</h3>
                <button
                  type="button"
                  onClick={addDistributionRow}
                  className="btn-add-row"
                >
                  <Plus size={18} />
                  Thêm dòng
                </button>
              </div>

              <div className="table-container">
                <table className="report-detail-table">
                  <thead>
                    <tr>
                      <th>Đại lý</th>
                      <th>Sản phẩm</th>
                      <th>SL xuất</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributionDetails.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            value={item.agency}
                            onChange={(e) => updateDistributionDetail(item.id, 'agency', e.target.value)}
                            className="table-input"
                            placeholder="Nhập đại lý"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) => updateDistributionDetail(item.id, 'product', e.target.value)}
                            className="table-input"
                            placeholder="Nhập sản phẩm"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateDistributionDetail(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="table-input"
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateDistributionDetail(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="table-input"
                            placeholder="0"
                          />
                        </td>
                        <td className="table-amount">
                          {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="table-action">
                          <button
                            type="button"
                            onClick={() => deleteDistributionRow(item.id)}
                            className="btn-delete"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="summary-section">
                <div className="summary-item highlight">
                  <span>Tổng giá trị phân phối:</span>
                  <strong>{distributionTotal.toLocaleString('vi-VN')} đ</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debt Report Section */}
        {reportType === 'debt' && (
          <div className="form-section">
            <h2 className="section-title">💳 Báo cáo công nợ</h2>
            
            {/* Filters */}
            <div className="filters-grid">
              <div className="form-group">
                <label className="form-label">Đại lý</label>
                <div className="custom-select">
                  <select
                    value={agencyFilterDebt}
                    onChange={(e) => setAgencyFilterDebt(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Tất cả</option>
                    <option value="agency1">Đại lý A</option>
                    <option value="agency2">Đại lý B</option>
                  </select>
                  <ChevronDown size={20} className="select-icon" />
                </div>
              </div>
            </div>

            {/* Details Table */}
            <div className="table-section">
              <div className="table-header-controls">
                <h3 className="table-title">Bảng công nợ</h3>
                <button
                  type="button"
                  onClick={addDebtRow}
                  className="btn-add-row"
                >
                  <Plus size={18} />
                  Thêm dòng
                </button>
              </div>

              <div className="table-container">
                <table className="report-detail-table">
                  <thead>
                    <tr>
                      <th>Đại lý</th>
                      <th>Tổng phải thu</th>
                      <th>Đã thu</th>
                      <th>Còn nợ</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtDetails.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            value={item.agency}
                            onChange={(e) => updateDebtDetail(item.id, 'agency', e.target.value)}
                            className="table-input"
                            placeholder="Nhập đại lý"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.totalDue}
                            onChange={(e) => updateDebtDetail(item.id, 'totalDue', parseFloat(e.target.value) || 0)}
                            className="table-input"
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.collected}
                            onChange={(e) => updateDebtDetail(item.id, 'collected', parseFloat(e.target.value) || 0)}
                            className="table-input"
                            placeholder="0"
                          />
                        </td>
                        <td className="table-amount">
                          {(item.totalDue - item.collected).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="table-action">
                          <button
                            type="button"
                            onClick={() => deleteDebtRow(item.id)}
                            className="btn-delete"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="summary-section">
                <div className="summary-item highlight">
                  <span>Tổng công nợ còn lại:</span>
                  <strong>{debtTotal.toLocaleString('vi-VN')} đ</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/staff/reports')}
            className="btn-cancel"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="btn-submit"
          >
            Tạo báo cáo
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddReport



