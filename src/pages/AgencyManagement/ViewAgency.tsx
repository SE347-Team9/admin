import { Building2, ArrowLeft, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import './ViewAgency.css'

const ViewAgency = () => {
  const navigate = useNavigate()
  useParams()

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount).replace('₫', 'đ')
  }

  // Mock data - should fetch from API based on id
  const agency = {
    id: '1',
    code: 'DL001',
    name: 'Đại lý Nghĩa',
    address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
    phone: '02232434242',
    email: 'nghiaagency@gmail.com',
    level: 1,
    levelLabel: 'Cấp 1',
    totalSales: 150000000,
    debt: 25000000,
    debtLimit: 50000000,
    status: 'active',
    statusLabel: 'Hoạt động',
    createdAt: '01/01/2024',
    updatedAt: '20/10/2025'
  }

  const handleBack = () => {
    navigate('/agency-management')
  }

  const handleEdit = () => {
    navigate(`/edit-agency/${agency.id}`)
  }

  return (
    <div className="view-agency-page">
      <div className="view-agency-container">
        {/* Header */}
        <div className="view-agency__header">
          <div className="view-agency__header-icon">
            <Building2 size={36} />
          </div>
          <div className="view-agency__header-content">
            <h1 className="view-agency__title">Chi tiết đại lý</h1>
            <p className="view-agency__subtitle">
              Xem thông tin chi tiết của đại lý trong hệ thống
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="view-agency__content">
          <div className="view-agency__card">
            <h2 className="view-agency__card-title">Thông tin đại lý</h2>
            <div className="view-agency__info-grid">
              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Mã đại lý:</span>
                <span className="view-agency__info-value view-agency__code">{agency.code}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Tên đại lý:</span>
                <span className="view-agency__info-value">{agency.name}</span>
              </div>

              <div className="view-agency__info-item view-agency__info-item--full">
                <span className="view-agency__info-label">Địa chỉ:</span>
                <span className="view-agency__info-value">{agency.address}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Số điện thoại:</span>
                <span className="view-agency__info-value">{agency.phone}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Email:</span>
                <span className="view-agency__info-value">{agency.email}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Cấp đại lý:</span>
                <span className={`view-agency__level-badge level-${agency.level}`}>
                  {agency.levelLabel}
                </span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Doanh số nhập hàng:</span>
                <span className="view-agency__info-value view-agency__sales">{formatCurrency(agency.totalSales)}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Công nợ:</span>
                <div className="view-agency__debt-info">
                  <span className="view-agency__debt-amount">{formatCurrency(agency.debt)}</span>
                  <span className="view-agency__debt-limit">/ {formatCurrency(agency.debtLimit)}</span>
                </div>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Ngày tạo:</span>
                <span className="view-agency__info-value">{agency.createdAt}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Cập nhật lần cuối:</span>
                <span className="view-agency__info-value">{agency.updatedAt}</span>
              </div>

              <div className="view-agency__info-item">
                <span className="view-agency__info-label">Trạng thái:</span>
                <span className={`view-agency__status ${agency.status}`}>
                  {agency.statusLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="view-agency__footer">
          <button className="view-agency__btn view-agency__btn--secondary" onClick={handleBack}>
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>
          <button className="view-agency__btn view-agency__btn--primary" onClick={handleEdit}>
            <Edit size={20} />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewAgency
