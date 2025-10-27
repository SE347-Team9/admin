import { Users, Eye, Edit, Trash2, UserPlus, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './AccountManagement.css'

interface Account {
  id: string
  code: string
  username: string
  fullName: string
  email: string
  phone: string
  role: 'admin' | 'agency' | 'staff'
  roleLabel: string
  status: 'active' | 'inactive' | 'pending'
  statusLabel: string
  createdAt: string
}

const AccountManagement = () => {
  const navigate = useNavigate()

  // Statistics data
  const totalAccounts = 15
  const activeAccounts = 12
  const inactiveAccounts = 2
  const pendingAccounts = 1

  // Mock data
  const accounts: Account[] = [
    {
      id: '1',
      code: 'ADM001',
      username: 'admin01',
      fullName: 'Nguyễn Văn A',
      email: 'admin01@example.com',
      phone: '0123456789',
      role: 'admin',
      roleLabel: 'Quản trị viên',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '01/01/2024'
    },
    {
      id: '2',
      code: 'DL001',
      username: 'agency01',
      fullName: 'Trần Thị B',
      email: 'agency01@example.com',
      phone: '0987654321',
      role: 'agency',
      roleLabel: 'Đại lý',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '15/02/2024'
    },
    {
      id: '3',
      code: 'NV001',
      username: 'staff01',
      fullName: 'Lê Văn C',
      email: 'staff01@example.com',
      phone: '0369852147',
      role: 'staff',
      roleLabel: 'Nhân viên',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '20/03/2024'
    },
    {
      id: '4',
      code: 'DL002',
      username: 'agency02',
      fullName: 'Phạm Thị D',
      email: 'agency02@example.com',
      phone: '0912345678',
      role: 'agency',
      roleLabel: 'Đại lý',
      status: 'inactive',
      statusLabel: 'Ngừng hoạt động',
      createdAt: '10/04/2024'
    },
    {
      id: '5',
      code: 'NV002',
      username: 'staff02',
      fullName: 'Hoàng Văn E',
      email: 'staff02@example.com',
      phone: '0901234567',
      role: 'staff',
      roleLabel: 'Nhân viên',
      status: 'pending',
      statusLabel: 'Chờ duyệt',
      createdAt: '25/10/2025'
    }
  ]

  const getRoleClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'role-admin'
      case 'agency':
        return 'role-agency'
      case 'staff':
        return 'role-staff'
      default:
        return ''
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'inactive':
        return 'status-inactive'
      case 'pending':
        return 'status-pending'
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
      case 'pending':
        return <Clock size={14} />
      default:
        return <CheckCircle2 size={14} />
    }
  }

  const handleViewAccount = (accountId: string) => {
    navigate(`/view-account/${accountId}`)
  }

  const handleEditAccount = (accountId: string) => {
    navigate(`/edit-account/${accountId}`)
  }

  const handleDeleteAccount = (account: Account) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${account.username}"?`)) {
      toast.success(`Đã xóa tài khoản ${account.username}`)
      // TODO: Call API to delete account
    }
  }

  return (
    <div className="account-management-page">
      {/* Page Header */}
      <div className="account-header">
        <div className="header-icon-box">
          <Users size={36} />
        </div>
        <div className="header-text">
          <h1 className="account-title">Quản lý tài khoản</h1>
          <p className="account-subtitle">
            Quản lý thông tin tài khoản người dùng, phân quyền và theo dõi trạng thái hoạt động.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards-grid">
        <div className="stats-card gradient-blue">
          <div className="stats-card-content">
            <div className="stats-label">Tổng tài khoản</div>
            <div className="stats-value">{totalAccounts}</div>
          </div>
          <div className="stats-icon">
            <Users size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-green">
          <div className="stats-card-content">
            <div className="stats-label">Đang hoạt động</div>
            <div className="stats-value">{activeAccounts}</div>
          </div>
          <div className="stats-icon">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-red">
          <div className="stats-card-content">
            <div className="stats-label">Ngừng hoạt động</div>
            <div className="stats-value">{inactiveAccounts}</div>
          </div>
          <div className="stats-icon">
            <XCircle size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-yellow">
          <div className="stats-card-content">
            <div className="stats-label">Chờ duyệt</div>
            <div className="stats-value">{pendingAccounts}</div>
          </div>
          <div className="stats-icon">
            <Clock size={44} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Accounts List Section */}
      <div className="accounts-section">
        <div className="section-header">
          <div className="header-left">
            <Users size={24} />
            <h2>Danh sách tài khoản ({accounts.length})</h2>
          </div>
          <button 
            className="btn-create-account"
            onClick={() => navigate('/add-account')}
          >
            <UserPlus size={20} />
            Thêm tài khoản
          </button>
        </div>

        <div className="accounts-table-container">
          <table className="accounts-table">
            <thead>
              <tr>
                <th>MÃ TK</th>
                <th>TÊN ĐĂNG NHẬP</th>
                <th>HỌ VÀ TÊN</th>
                <th>EMAIL</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>VAI TRÒ</th>
                <th>TRẠNG THÁI</th>
                <th>NGÀY TẠO</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.id}>
                  <td>
                    <span className="account-code">{account.code}</span>
                  </td>
                  <td>{account.username}</td>
                  <td>{account.fullName}</td>
                  <td className="text-muted">{account.email}</td>
                  <td className="text-muted">{account.phone}</td>
                  <td>
                    <span className={`role-badge ${getRoleClass(account.role)}`}>
                      {account.roleLabel}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(account.status)}`}>
                      {getStatusIcon(account.status)}
                      {account.statusLabel}
                    </span>
                  </td>
                  <td className="text-muted">{account.createdAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="Xem chi tiết"
                        onClick={() => handleViewAccount(account.id)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-edit" 
                        title="Chỉnh sửa"
                        onClick={() => handleEditAccount(account.id)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        title="Xóa"
                        onClick={() => handleDeleteAccount(account)}
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
    </div>
  )
}

export default AccountManagement
