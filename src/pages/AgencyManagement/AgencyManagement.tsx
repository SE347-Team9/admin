import { Building2, Eye, Edit, Trash2, UserPlus, CheckCircle2, XCircle, Award, Crown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import './AgencyManagement.css'

interface Agency {
  id: string
  code: string
  name: string
  address: string
  phone: string
  email: string
  type: 'level_1' | 'level_2'
  typeLabel: string
  debtLimit: number
  currentDebt: number
  status: 'active' | 'inactive'
  statusLabel: string
  createdAt: string
}

const AgencyManagement = () => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteAgency, setDeleteAgency] = useState<Agency | null>(null)

  // Statistics data
  const totalAgencies = 10
  const activeAgencies = 8
  const inactiveAgencies = 2
  const level1Agencies = 4
  const level2Agencies = 6

  // Mock data
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: '1',
      code: 'DL001',
      name: 'Đại lý Nghĩa',
      address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
      phone: '02232434242',
      email: 'nghiaagency@gmail.com',
      type: 'level_1',
      typeLabel: 'Cấp 1',
      debtLimit: 100000000,
      currentDebt: 45000000,
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '01/01/2024'
    },
    {
      id: '2',
      code: 'DL002',
      name: 'Đại lý Đại',
      address: 'Số 2, Phố Đông Đa, Đông Đa, Hà Nội',
      phone: '02232434242',
      email: 'daiagency@gmail.com',
      type: 'level_2',
      typeLabel: 'Cấp 2',
      debtLimit: 50000000,
      currentDebt: 30000000,
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '15/02/2024'
    },
    {
      id: '3',
      code: 'DL003',
      name: 'Đại lý An Khang',
      address: 'Số 3, Phố Hai Bà Trưng, Hoàn Kiếm, Hà Nội',
      phone: '0369852147',
      email: 'ankhang@gmail.com',
      type: 'level_1',
      typeLabel: 'Cấp 1',
      debtLimit: 100000000,
      currentDebt: 75000000,
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '20/03/2024'
    },
    {
      id: '4',
      code: 'DL004',
      name: 'Đại lý Minh Phát',
      address: 'Số 4, Phố Lê Thanh Tông, Hoan Kiếm, Hà Nội',
      phone: '0912345678',
      email: 'minhphat@gmail.com',
      type: 'level_2',
      typeLabel: 'Cấp 2',
      debtLimit: 50000000,
      currentDebt: 0,
      status: 'inactive',
      statusLabel: 'Ngừng hoạt động',
      createdAt: '10/04/2024'
    },
    {
      id: '5',
      code: 'DL005',
      name: 'Đại lý Thái Hà',
      address: 'Số 5, Phố Thái Hà, Đống Đa, Hà Nội',
      phone: '0901234567',
      email: 'thaiha@gmail.com',
      type: 'level_1',
      typeLabel: 'Cấp 1',
      debtLimit: 100000000,
      currentDebt: 60000000,
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '25/10/2025'
    }
  ])

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'inactive':
        return 'status-inactive'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 size={14} />
      case 'inactive':
        return <XCircle size={14} />
      default:
        return <CheckCircle2 size={14} />
    }
  }

  const getTypeClass = (type: string) => {
    return type === 'level_1' ? 'type-level1' : 'type-level2'
  }

  const getTypeIcon = (type: string) => {
    return type === 'level_1' ? <Crown size={14} /> : <Award size={14} />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const handleDeleteAgency = (agency: Agency) => {
    setDeleteAgency(agency)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteAgency) {
      setAgencies(prev => prev.filter(agency => agency.id !== deleteAgency.id))
      toast.success(`Đã xóa đại lý ${deleteAgency.name}`)
    }
    setShowDeleteModal(false)
    setDeleteAgency(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteAgency(null)
  }

  const handleViewAgency = (agencyId: string) => {
    navigate(`/view-agency/${agencyId}`)
  }

  const handleEditAgency = (agencyId: string) => {
    navigate(`/edit-agency/${agencyId}`)
  }

  return (
    <div className="agency-management-page">
      {/* Page Header */}
      <div className="agency-header">
        <div className="header-icon-box">
          <Building2 size={36} />
        </div>
        <div className="header-text">
          <h1 className="agency-title">Quản lý đại lý</h1>
          <p className="agency-subtitle">
            Quản lý thông tin đại lý, phân loại và theo dõi trạng thái hoạt động.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards-grid">
        <div className="stats-card gradient-blue">
          <div className="stats-card-content">
            <div className="stats-label">Tổng đại lý</div>
            <div className="stats-value">{totalAgencies}</div>
          </div>
          <div className="stats-icon">
            <Building2 size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-purple">
          <div className="stats-card-content">
            <div className="stats-label">Đại lý cấp 1</div>
            <div className="stats-value">{level1Agencies}</div>
          </div>
          <div className="stats-icon">
            <Crown size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-orange">
          <div className="stats-card-content">
            <div className="stats-label">Đại lý cấp 2</div>
            <div className="stats-value">{level2Agencies}</div>
          </div>
          <div className="stats-icon">
            <Award size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-green">
          <div className="stats-card-content">
            <div className="stats-label">Đang hoạt động</div>
            <div className="stats-value">{activeAgencies}</div>
          </div>
          <div className="stats-icon">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-red">
          <div className="stats-card-content">
            <div className="stats-label">Ngừng hoạt động</div>
            <div className="stats-value">{inactiveAgencies}</div>
          </div>
          <div className="stats-icon">
            <XCircle size={44} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Agencies List Section */}
      <div className="agencies-section">
        <div className="section-header">
          <div className="header-left">
            <Building2 size={24} />
            <h2>Danh sách đại lý ({agencies.length})</h2>
          </div>
          <button 
            className="btn-create-agency"
            onClick={() => navigate('/add-agency')}
          >
            <UserPlus size={20} />
            Thêm đại lý
          </button>
        </div>

        <div className="agencies-table-container">
          <table className="agencies-table">
            <thead>
              <tr>
                <th>MÃ ĐẠI LÝ</th>
                <th>TÊN ĐẠI LÝ</th>
                <th>LOẠI</th>
                <th>ĐỊA CHỈ</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>CÔNG NỢ HIỆN TẠI</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.id}>
                  <td>
                    <span className="agency-code">{agency.code}</span>
                  </td>
                  <td>{agency.name}</td>
                  <td>
                    <span className={`type-badge ${getTypeClass(agency.type)}`}>
                      {getTypeIcon(agency.type)}
                      {agency.typeLabel}
                    </span>
                  </td>
                  <td className="text-muted">{agency.address}</td>
                  <td className="text-muted">{agency.phone}</td>
                  <td>
                    <div className="debt-info">
                      <span className={`debt-amount ${agency.currentDebt > agency.debtLimit * 0.8 ? 'debt-warning' : ''}`}>
                        {formatCurrency(agency.currentDebt)}
                      </span>
                      <span className="debt-limit">/ {formatCurrency(agency.debtLimit)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(agency.status)}`}>
                      {getStatusIcon(agency.status)}
                      {agency.statusLabel}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="Xem chi tiết"
                        onClick={() => handleViewAgency(agency.id)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-edit" 
                        title="Chỉnh sửa"
                        onClick={() => handleEditAgency(agency.id)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        title="Xóa"
                        onClick={() => handleDeleteAgency(agency)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận xóa đại lý */}
      {showDeleteModal && deleteAgency && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content modal-delete-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-delete-modern-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="modal-delete-modern-title">Xác nhận xóa đại lý</div>
            <div className="modal-delete-modern-desc">
              Bạn có chắc chắn muốn xóa đại lý <b>{deleteAgency.name}</b>?
            </div>
            <div className="modal-delete-modern-warning">Hành động này không thể hoàn tác.</div>
            <div className="modal-delete-modern-actions">
              <button className="btn-modal-cancel-modern" onClick={handleCancelDelete}>Hủy</button>
              <button className="btn-modal-delete-modern" onClick={handleConfirmDelete}>Xóa đại lý</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgencyManagement
