import { FileText, Eye, FileSpreadsheet, Download, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import html2pdf from 'html2pdf.js'
import { toast } from 'react-toastify'
import './Reports.css'

interface Report {
  id: string
  code: string
  title: string
  type: 'revenue' | 'debt'
  typeLabel: string
  createdDate: string
  status: 'completed'
  statusLabel: string
  createdAt: string
}

interface AgencyRevenue {
  code: string
  name: string
  revenue: number
}

interface AgencyDebt {
  code: string
  name: string
  debt: number
}

const Reports = () => {
  const navigate = useNavigate()
  // Statistics data
  const totalRevenue = 2430000
  const totalDebt = 36460000
  const agencyCount = 2

  // Mock data
  const reports: Report[] = [
    {
      id: '1',
      code: 'BC4',
      title: 'Báo cáo doanh số',
      type: 'revenue',
      typeLabel: 'Doanh thu',
      createdDate: '11/10/2025',
      status: 'completed',
      statusLabel: 'Hoàn thành',
      createdAt: '1/1/1970'
    },
    {
      id: '2',
      code: 'BC5',
      title: 'Báo cáo công nợ',
      type: 'debt',
      typeLabel: 'Công nợ',
      createdDate: '11/9/2025',
      status: 'completed',
      statusLabel: 'Hoàn thành',
      createdAt: '1/1/1970'
    },
    {
      id: '3',
      code: 'BC1',
      title: 'Báo cáo doanh số',
      type: 'revenue',
      typeLabel: 'Doanh thu',
      createdDate: '30/6/2024',
      status: 'completed',
      statusLabel: 'Hoàn thành',
      createdAt: '30/6/2024'
    },
    {
      id: '4',
      code: 'BC2',
      title: 'Báo cáo công nợ',
      type: 'debt',
      typeLabel: 'Công nợ',
      createdDate: '30/6/2024',
      status: 'completed',
      statusLabel: 'Hoàn thành',
      createdAt: '30/6/2024'
    }
  ]

  const topRevenueAgencies: AgencyRevenue[] = [
    { code: 'DL1', name: 'Đại lý Nghĩa', revenue: 1530000 },
    { code: 'DL2', name: 'Đại lý Đại', revenue: 900000 }
  ]

  const topDebtAgencies: AgencyDebt[] = [
    { code: 'DL1', name: 'Đại lý Nghĩa', debt: 24060000 },
    { code: 'DL2', name: 'Đại lý Đại', debt: 12400000 }
  ]

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'revenue':
        return 'type-revenue'
      case 'debt':
        return 'type-debt'
      default:
        return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'revenue':
        return <TrendingUp size={14} />
      case 'debt':
        return <TrendingDown size={14} />
      default:
        return <FileText size={14} />
    }
  }

  // Export single report to Excel
  const exportSingleReportToExcel = (report: Report) => {
    const wb = XLSX.utils.book_new()
    
    // Report details
    const reportDetails = [
      { 'Thông tin': 'Mã báo cáo', 'Giá trị': report.code },
      { 'Thông tin': 'Tiêu đề', 'Giá trị': report.title },
      { 'Thông tin': 'Loại báo cáo', 'Giá trị': report.typeLabel },
      { 'Thông tin': 'Kỳ báo cáo', 'Giá trị': report.createdDate },
      { 'Thông tin': 'Trạng thái', 'Giá trị': report.statusLabel },
      { 'Thông tin': 'Ngày tạo', 'Giá trị': report.createdAt }
    ]
    
    const ws = XLSX.utils.json_to_sheet(reportDetails)
    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết báo cáo')
    
    // Add relevant data based on report type
    if (report.type === 'revenue') {
      const revenueData = topRevenueAgencies.map(agency => ({
        'Mã đại lý': agency.code,
        'Tên đại lý': agency.name,
        'Doanh số': agency.revenue
      }))
      const ws2 = XLSX.utils.json_to_sheet(revenueData)
      XLSX.utils.book_append_sheet(wb, ws2, 'Doanh số đại lý')
    } else if (report.type === 'debt') {
      const debtData = topDebtAgencies.map(agency => ({
        'Mã đại lý': agency.code,
        'Tên đại lý': agency.name,
        'Công nợ': agency.debt
      }))
      const ws2 = XLSX.utils.json_to_sheet(debtData)
      XLSX.utils.book_append_sheet(wb, ws2, 'Công nợ đại lý')
    }
    
    const fileName = `BaoCao_${report.code}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.xlsx`
    XLSX.writeFile(wb, fileName)
    toast.success(`Xuất báo cáo ${report.code} sang Excel thành công!`)
  }

  // Export single report to PDF with proper Vietnamese font support
  const exportSingleReportToPDF = (report: Report) => {
    // Create HTML content for PDF
    const htmlContent = `
      <div style="font-family: 'Arial Unicode MS', Arial, sans-serif; padding: 20px; line-height: 1.6;">
        <h1 style="text-align: center; color: #3b82f6; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          BÁO CÁO CHI TIẾT
        </h1>
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Mã báo cáo:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.code}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Tiêu đề:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.title}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Loại báo cáo:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.typeLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Kỳ báo cáo:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.createdDate}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Trạng thái:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.statusLabel}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Ngày tạo:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.createdAt}</td>
          </tr>
        </table>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #888;">
          <p style="margin: 0;">Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
      </div>
    `
    
    // Create a temporary container
    const element = document.createElement('div')
    element.innerHTML = htmlContent
    
    // Configure html2pdf options
    const opt = {
      margin: 10,
      filename: `BaoCao_${report.code}_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait' as const, unit: 'mm', format: 'a4' }
    }
    
    // Generate PDF
    html2pdf().set(opt).from(element).save()
    toast.success(`Xuất báo cáo ${report.code} sang PDF thành công!`)
  }

  return (
    <div className="reports-page">
      {/* Page Header */}
      <div className="reports-header">
        <div className="header-icon-box">
          <FileText size={36} />
        </div>
        <div className="header-text">
          <h1 className="reports-title">Lập báo cáo</h1>
          <p className="reports-subtitle">
            Tổng hợp, thống kê và quản lý các báo cáo doanh thu, tồn kho, công nợ và hoạt động của đại lý.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards-grid">
        <div className="stats-card gradient-green-blue">
          <div className="stats-card-content">
            <div className="stats-label">Tổng doanh thu</div>
            <div className="stats-value">{totalRevenue.toLocaleString('vi-VN')} đ</div>
          </div>
          <div className="stats-icon">
            <TrendingUp size={48} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-pink">
          <div className="stats-card-content">
            <div className="stats-label">Tổng công nợ</div>
            <div className="stats-value">{totalDebt.toLocaleString('vi-VN')} đ</div>
          </div>
          <div className="stats-icon">
            <TrendingDown size={48} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-purple">
          <div className="stats-card-content">
            <div className="stats-label">Số lượng đại lý</div>
            <div className="stats-value">{agencyCount}</div>
          </div>
          <div className="stats-icon">
            <CheckCircle2 size={48} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Reports List Section */}
      <div className="reports-section">
        <div className="section-header">
          <div className="header-left">
            <FileText size={24} />
            <h2>Danh sách báo cáo ({reports.length})</h2>
          </div>
          <button 
            className="btn-create-report"
            onClick={() => navigate('/add-report')}
          >
            <FileText size={20} />
            Lập báo cáo
          </button>
        </div>

        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>MÃ BÁO CÁO</th>
                <th>TIÊU ĐỀ</th>
                <th>LOẠI</th>
                <th>KỲ BÁO CÁO</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY TẠO</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className="report-code">{report.code}</span>
                  </td>
                  <td>{report.title}</td>
                  <td>
                    <span className={`type-badge ${getTypeClass(report.type)}`}>
                      {getTypeIcon(report.type)}
                      {report.typeLabel}
                    </span>
                  </td>
                  <td className="text-muted">{report.createdDate}</td>
                  <td>
                    <span className="status-badge status-completed">
                      <CheckCircle2 size={14} />
                      {report.statusLabel}
                    </span>
                  </td>
                  <td className="text-muted">{report.createdAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        title="Xem"
                        onClick={() => navigate(`/view-report/${report.id}`)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="btn-icon" 
                        title="Xuất Excel"
                        onClick={() => exportSingleReportToExcel(report)}
                      >
                        <FileSpreadsheet size={18} />
                      </button>
                      <button 
                        className="btn-icon" 
                        title="Xuất PDF"
                        onClick={() => exportSingleReportToPDF(report)}
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics-grid">
        {/* Top Revenue Agencies */}
        <div className="report-stat-card">
          <div className="report-stat-card-header">
            <TrendingUp size={20} />
            <h3>Danh sách đại lý có doanh số cao nhất</h3>
          </div>
          <div className="report-stat-card-body">
            <table className="report-stat-table">
              <thead>
                <tr>
                  <th>MÃ ĐẠI LÝ</th>
                  <th>TÊN ĐẠI LÝ</th>
                  <th>DOANH SỐ</th>
                </tr>
              </thead>
              <tbody>
                {topRevenueAgencies.map((agency) => (
                  <tr key={agency.code}>
                    <td>
                      <span className="report-agency-code">{agency.code}</span>
                    </td>
                    <td>{agency.name}</td>
                    <td>
                      <span className="report-revenue-value">
                        {agency.revenue.toLocaleString('vi-VN')} đ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Debt Agencies */}
        <div className="report-stat-card">
          <div className="report-stat-card-header debt">
            <TrendingDown size={20} />
            <h3>Danh sách đại lý có công nợ cao nhất</h3>
          </div>
          <div className="report-stat-card-body">
            <table className="report-stat-table">
              <thead>
                <tr>
                  <th>MÃ ĐẠI LÝ</th>
                  <th>TÊN ĐẠI LÝ</th>
                  <th>CÔNG NỢ</th>
                </tr>
              </thead>
              <tbody>
                {topDebtAgencies.map((agency) => (
                  <tr key={agency.code}>
                    <td>
                      <span className="report-agency-code">{agency.code}</span>
                    </td>
                    <td>{agency.name}</td>
                    <td>
                      <span className="report-debt-value">
                        {agency.debt.toLocaleString('vi-VN')} đ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
