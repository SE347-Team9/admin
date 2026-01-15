import { FileText, Eye, FileSpreadsheet, Download, Package, Truck, CreditCard } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import * as XLSX from 'xlsx'
import html2pdf from 'html2pdf.js'
import { toast } from 'react-toastify'
import './Reports.css'

interface Report {
  id: string
  code: string
  type: 'import' | 'distribution' | 'debt'
  typeLabel: string
  period: string
  value: number
  employee: string
  createdDate: string
}

interface AgencyImport {
  code: string
  name: string
  importValue: number
}

interface AgencyDebt {
  code: string
  name: string
  debt: number
}

const Reports = () => {
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Statistics data
  const totalImportValue = 125000000
  const totalDistributionValue = 98500000
  const totalDebt = 36460000

  // Mock data
  const reports: Report[] = [
    {
      id: '1',
      code: 'BC1',
      type: 'import',
      typeLabel: 'Nhập kho',
      period: '10/2025',
      value: 45000000,
      employee: 'Nguyễn Văn A',
      createdDate: '15/01/2025'
    },
    {
      id: '2',
      code: 'BC2',
      type: 'distribution',
      typeLabel: 'Phân phối',
      period: '10/2025',
      value: 32000000,
      employee: 'Trần Thị B',
      createdDate: '14/01/2025'
    },
    {
      id: '3',
      code: 'BC3',
      type: 'debt',
      typeLabel: 'Công nợ',
      period: '09/2025',
      value: 24060000,
      employee: 'Lê Văn C',
      createdDate: '13/01/2025'
    },
    {
      id: '4',
      code: 'BC4',
      type: 'import',
      typeLabel: 'Nhập kho',
      period: '06/2024',
      value: 38000000,
      employee: 'Phạm Thị D',
      createdDate: '12/01/2025'
    }
  ]

  // Count reports by type
  const importReports = reports.filter(r => r.type === 'import')
  const distributionReports = reports.filter(r => r.type === 'distribution')
  const debtReports = reports.filter(r => r.type === 'debt')

  // Filter reports
  const filteredReports = useMemo(() => {
    if (typeFilter === 'all') return reports
    return reports.filter(r => r.type === typeFilter)
  }, [reports, typeFilter])

  // Tabs definition
  type TabType = 'all' | 'import' | 'distribution' | 'debt'
  const tabs = [
    { key: 'all' as TabType, label: 'Tất cả', icon: FileText, count: reports.length, color: '#3b82f6' },
    { key: 'import' as TabType, label: 'Nhập kho', icon: Package, count: importReports.length, color: '#10b981' },
    { key: 'distribution' as TabType, label: 'Phân phối', icon: Truck, count: distributionReports.length, color: '#8b5cf6' },
    { key: 'debt' as TabType, label: 'Công nợ', icon: CreditCard, count: debtReports.length, color: '#ef4444' },
  ]

  const topImportAgencies: AgencyImport[] = [
    { code: 'DL1', name: 'Đại lý Nghĩa', importValue: 45000000 },
    { code: 'DL2', name: 'Đại lý Đại', importValue: 32000000 }
  ]

  const topDebtAgencies: AgencyDebt[] = [
    { code: 'DL1', name: 'Đại lý Nghĩa', debt: 24060000 },
    { code: 'DL2', name: 'Đại lý Đại', debt: 12400000 }
  ]

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'import':
        return 'type-import'
      case 'distribution':
        return 'type-distribution'
      case 'debt':
        return 'type-debt'
      default:
        return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'import':
        return <Package size={14} />
      case 'distribution':
        return <Truck size={14} />
      case 'debt':
        return <CreditCard size={14} />
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
      { 'Thông tin': 'Loại báo cáo', 'Giá trị': report.typeLabel },
      { 'Thông tin': 'Kỳ báo cáo', 'Giá trị': report.period },
      { 'Thông tin': 'Giá trị', 'Giá trị': report.value.toLocaleString('vi-VN') + ' đ' },
      { 'Thông tin': 'Nhân viên', 'Giá trị': report.employee },
      { 'Thông tin': 'Ngày tạo', 'Giá trị': report.createdDate }
    ]
    
    const ws = XLSX.utils.json_to_sheet(reportDetails)
    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết báo cáo')
    
    // Add relevant data based on report type
    if (report.type === 'import') {
      const importData = topImportAgencies.map(agency => ({
        'Mã đại lý': agency.code,
        'Tên đại lý': agency.name,
        'Giá trị nhập kho': agency.importValue
      }))
      const ws2 = XLSX.utils.json_to_sheet(importData)
      XLSX.utils.book_append_sheet(wb, ws2, 'Giá trị nhập kho đại lý')
    } else if (report.type === 'distribution') {
      const distributionData = topImportAgencies.map(agency => ({
        'Mã đại lý': agency.code,
        'Tên đại lý': agency.name,
        'Giá trị phân phối': agency.importValue * 0.8
      }))
      const ws2 = XLSX.utils.json_to_sheet(distributionData)
      XLSX.utils.book_append_sheet(wb, ws2, 'Giá trị phân phối đại lý')
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
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Loại báo cáo:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.typeLabel}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Kỳ báo cáo:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.period}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Giá trị:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.value.toLocaleString('vi-VN')} đ</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Nhân viên:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.employee}</td>
          </tr>
          <tr>
            <td style="padding: 10px 15px; border: 1px solid #ddd; font-weight: bold; width: 40%;">Ngày tạo:</td>
            <td style="padding: 10px 15px; border: 1px solid #ddd;">${report.createdDate}</td>
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
            <div className="stats-label">Tổng giá trị nhập kho</div>
            <div className="stats-value">{totalImportValue.toLocaleString('vi-VN')} đ</div>
          </div>
          <div className="stats-icon">
            <Package size={48} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-purple">
          <div className="stats-card-content">
            <div className="stats-label">Tổng giá trị phân phối</div>
            <div className="stats-value">{totalDistributionValue.toLocaleString('vi-VN')} đ</div>
          </div>
          <div className="stats-icon">
            <Truck size={48} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-pink">
          <div className="stats-card-content">
            <div className="stats-label">Tổng công nợ</div>
            <div className="stats-value">{totalDebt.toLocaleString('vi-VN')} đ</div>
          </div>
          <div className="stats-icon">
            <CreditCard size={48} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Reports List Section */}
      <div className="reports-section">
        <div className="section-header">
          <div className="header-left">
            <FileText size={24} />
            <h2>Danh sách báo cáo ({filteredReports.length})</h2>
          </div>
        </div>

        {/* Tabs lọc theo loại báo cáo */}
        <div className="report-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`report-tab ${typeFilter === tab.key ? 'active' : ''}`}
              onClick={() => setTypeFilter(tab.key)}
              style={{ '--tab-color': tab.color } as React.CSSProperties}
            >
              <tab.icon size={20} />
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
        </div>

        <div className="reports-table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>MÃ BÁO CÁO</th>
                <th>LOẠI</th>
                <th>KỲ BÁO CÁO</th>
                <th>GIÁ TRỊ</th>
                <th>NHÂN VIÊN</th>
                <th>NGÀY TẠO</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className="report-code">{report.code}</span>
                  </td>
                  <td>
                    <span className={`type-badge ${getTypeClass(report.type)}`}>
                      {getTypeIcon(report.type)}
                      {report.typeLabel}
                    </span>
                  </td>
                  <td className="text-muted">{report.period}</td>
                  <td>
                    <span className="report-value">{report.value.toLocaleString('vi-VN')} đ</span>
                  </td>
                  <td className="text-muted">{report.employee}</td>
                  <td className="text-muted">{report.createdDate}</td>
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
        {/* Top Import Agencies */}
        <div className="report-stat-card">
          <div className="report-stat-card-header import">
            <Package size={20} />
            <h3>Danh sách đại lý có doanh số nhập hàng cao nhất</h3>
          </div>
          <div className="report-stat-card-body">
            <table className="report-stat-table">
              <thead>
                <tr>
                  <th>MÃ ĐẠI LÝ</th>
                  <th>TÊN ĐẠI LÝ</th>
                  <th>GIÁ TRỊ NHẬP</th>
                </tr>
              </thead>
              <tbody>
                {topImportAgencies.map((agency) => (
                  <tr key={agency.code}>
                    <td>
                      <span className="report-agency-code">{agency.code}</span>
                    </td>
                    <td>{agency.name}</td>
                    <td>
                      <span className="report-import-value">
                        {agency.importValue.toLocaleString('vi-VN')} đ
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
            <CreditCard size={20} />
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
