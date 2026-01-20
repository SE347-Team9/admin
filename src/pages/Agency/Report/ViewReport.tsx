import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FileText, ArrowLeft, Download, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import html2pdf from 'html2pdf.js'
import { toast } from 'react-toastify'
import reportService from '../../../api/endpoints/reportService'
import './ViewReport.css'

interface ReportData {
  id: string
  code: string
  title: string
  type: 'revenue' | 'debt'
  typeLabel: string
  reportPeriod: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  reportPeriodLabel: string
  startDate: string
  endDate: string
  notes: string
  createdDate: string
  status: 'completed' | 'pending'
  statusLabel: string
  createdAt: string
  createdBy: string
}

interface AgencyData {
  code: string
  name: string
  value: number
}

const ViewReport = () => {
  const navigate = useNavigate()
  const { reportId } = useParams<{ reportId: string }>()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (reportId) {
      fetchReport(parseInt(reportId))
    }
  }, [reportId])

  const fetchReport = async (id: number) => {
    try {
      setLoading(true)
      const response = await reportService.getById(id)
      if (response.success) {
        const apiReport = response.data
        const transformed: ReportData = {
          id: apiReport.id.toString(),
          code: apiReport.code,
          title: apiReport.title,
          type: apiReport.type as 'revenue' | 'debt',
          typeLabel: apiReport.type === 'revenue' ? 'Doanh số' : 'Công nợ',
          reportPeriod: apiReport.data?.period || 'monthly',
          reportPeriodLabel: 'Theo tháng',
          startDate: apiReport.data?.startDate || '',
          endDate: apiReport.data?.endDate || '',
          notes: apiReport.data?.notes || '',
          createdDate: new Date(apiReport.createdAt).toLocaleDateString('vi-VN'),
          status: 'completed',
          statusLabel: 'Hoàn thành',
          createdAt: new Date(apiReport.createdAt).toLocaleString('vi-VN'),
          createdBy: 'Đại lý'
        }
        setReportData(transformed)
      }
    } catch (error) {
      console.error('Error fetching report:', error)
      toast.error('Không thể tải báo cáo')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="view-report-page"><p>Đang tải báo cáo...</p></div>
  }

  if (!reportData) {
    return <div className="view-report-page"><p>Không tìm thấy báo cáo</p></div>
  }

  // Mock agency data
  const agencyData: AgencyData[] = [
    { code: 'DL1', name: 'Đại lý Nghĩa', value: 1530000 },
    { code: 'DL2', name: 'Đại lý Đại', value: 900000 }
  ]

  const totalValue = agencyData.reduce((sum, item) => sum + item.value, 0)

  // Export report to Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()

    // Report info sheet
    const reportInfo = [
      { 'Thông tin': 'Mã báo cáo', 'Giá trị': reportData.code },
      { 'Thông tin': 'Tiêu đề', 'Giá trị': reportData.title },
      { 'Thông tin': 'Loại báo cáo', 'Giá trị': reportData.typeLabel },
      { 'Thông tin': 'Kỳ báo cáo', 'Giá trị': reportData.reportPeriodLabel },
      { 'Thông tin': 'Ngày bắt đầu', 'Giá trị': reportData.startDate },
      { 'Thông tin': 'Ngày kết thúc', 'Giá trị': reportData.endDate },
      { 'Thông tin': 'Ghi chú', 'Giá trị': reportData.notes },
      { 'Thông tin': 'Ngày tạo', 'Giá trị': reportData.createdAt },
      { 'Thông tin': 'Người tạo', 'Giá trị': reportData.createdBy },
      { 'Thông tin': 'Trạng thái', 'Giá trị': reportData.statusLabel }
    ]

    const ws1 = XLSX.utils.json_to_sheet(reportInfo)
    XLSX.utils.book_append_sheet(wb, ws1, 'Thông tin báo cáo')

    // Agency data sheet
    const agencyInfo = agencyData.map(agency => ({
      'Mã đại lý': agency.code,
      'Tên đại lý': agency.name,
      'Giá trị': agency.value.toLocaleString('vi-VN')
    }))

    const ws2 = XLSX.utils.json_to_sheet(agencyInfo)
    XLSX.utils.book_append_sheet(wb, ws2, `Chi tiết ${reportData.typeLabel}`)

    const filename = `BaoCao_${reportData.code}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`
    XLSX.writeFile(wb, filename)
    toast.success(`Xuất báo cáo ${reportData.code} sang Excel thành công!`)
  }

  // Export report to PDF
  const exportToPDF = () => {
    const element = document.getElementById('report-content')
    if (!element) return

    const opt = {
      margin: 10,
      filename: `BaoCao_${reportData.code}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
    }

    html2pdf().set(opt).from(element).save()
    toast.success(`Xuất báo cáo ${reportData.code} sang PDF thành công!`)
  }

  const handleBack = () => {
    navigate('/agency/reports')
  }

  return (
    <div className="view-report-page">
      <div className="view-report-container">
        {/* Back Button */}
        <button className="view-report__back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          Quay lại
        </button>

        {/* Header */}
        <div className="view-report__header">
          <div className="view-report__header-icon">
            <FileText size={36} />
          </div>
          <div className="view-report__header-content">
            <h1 className="view-report__title">Xem báo cáo</h1>
            <p className="view-report__subtitle">
              Chi tiết về báo cáo {reportData.typeLabel.toLowerCase()} đã lập
            </p>
          </div>
          <div className="view-report__actions-header">
            <button className="view-report__btn view-report__btn--icon" onClick={exportToExcel} title="Xuất Excel">
              <FileSpreadsheet size={20} />
            </button>
            <button className="view-report__btn view-report__btn--icon" onClick={exportToPDF} title="Xuất PDF">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div id="report-content" className="view-report__content">
          {/* Report Info Card */}
          <div className="view-report__card">
            <h2 className="view-report__card-title">Thông tin báo cáo</h2>
            <div className="view-report__info-grid">
              <div className="view-report__info-item">
                <span className="view-report__info-label">Mã báo cáo:</span>
                <span className="view-report__info-value">{reportData.code}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Tiêu đề:</span>
                <span className="view-report__info-value">{reportData.title}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Loại báo cáo:</span>
                <span className="view-report__info-value">{reportData.typeLabel}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Kỳ báo cáo:</span>
                <span className="view-report__info-value">{reportData.reportPeriodLabel}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Ngày bắt đầu:</span>
                <span className="view-report__info-value">{reportData.startDate}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Ngày kết thúc:</span>
                <span className="view-report__info-value">{reportData.endDate}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Ngày tạo:</span>
                <span className="view-report__info-value">{reportData.createdAt}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Người tạo:</span>
                <span className="view-report__info-value">{reportData.createdBy}</span>
              </div>
              <div className="view-report__info-item">
                <span className="view-report__info-label">Trạng thái:</span>
                <span className={`view-report__status ${reportData.status}`}>
                  {reportData.statusLabel}
                </span>
              </div>
            </div>

            {/* Notes */}
            {reportData.notes && (
              <div className="view-report__notes">
                <h3 className="view-report__notes-title">Ghi chú</h3>
                <p className="view-report__notes-content">{reportData.notes}</p>
              </div>
            )}
          </div>

          {/* Data Table Card */}
          <div className="view-report__card">
            <h2 className="view-report__card-title">Chi tiết {reportData.typeLabel.toLowerCase()}</h2>
            <div className="view-report__table-container">
              <table className="view-report__table">
                <thead>
                  <tr>
                    <th>MÃ ĐẠI LÝ</th>
                    <th>TÊN ĐẠI LÝ</th>
                    <th className="text-right">{reportData.typeLabel.toUpperCase()}</th>
                  </tr>
                </thead>
                <tbody>
                  {agencyData.map((agency, index) => (
                    <tr key={index}>
                      <td className="text-bold">{agency.code}</td>
                      <td>{agency.name}</td>
                      <td className="text-right text-bold">
                        {agency.value.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                  <tr className="view-report__table-footer">
                    <td colSpan={2} className="text-bold">
                      Tổng cộng
                    </td>
                    <td className="text-right text-bold text-highlight">
                      {totalValue.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewReport



