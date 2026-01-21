import { Users, Eye, Edit, Trash2, UserPlus, CheckCircle2, XCircle, ShieldCheck, Building2, UserCog } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { accountService } from '../../api/endpoints/accountService'
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
  status: 'active' | 'inactive'
  statusLabel: string
  createdAt: string
}

type TabType = 'all' | 'admin' | 'staff' | 'agency'

const AccountManagement = () => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteAccount, setDeleteAccount] = useState<Account | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch accounts from API
  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await accountService.getAll()
      if (response.success) {
        // Transform data to match interface
        const transformedData = response.data.map((acc: any) => ({
          id: acc.id,
          code: acc.code,
          username: acc.username,
          fullName: acc.fullName,
          email: acc.email,
          phone: acc.phone,
          role: acc.role,
          roleLabel: acc.role === 'admin' ? 'Quản trị viên' : acc.role === 'agency' ? 'Đại lý' : 'Nhân viên',
          status: acc.status,
          statusLabel: acc.status === 'active' ? 'Hoạt động' : 'Không hoạt động',
          createdAt: new Date(acc.createdAt).toLocaleDateString('vi-VN')
        }))
        setAccounts(transformedData)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error)
      toast.error('Không thể tải danh sách tài khoản')
    } finally {
      setLoading(false)
    }
  }

  // Statistics data
  const totalAccounts = accounts.length
  const activeAccounts = accounts.filter(acc => acc.status === 'active').length
  const inactiveAccounts = accounts.filter(acc => acc.status === 'inactive').length

  // Remove mock data - commented out unused variable
  /*
  const [oldAccounts] = useState<Account[]>([
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
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '25/10/2025'
    }
  ])
  */

  // Removed unused getRoleClass function
  /*
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
  */

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

  const handleViewAccount = (accountId: string) => {
    navigate(`/admin/view-account/${accountId}`)
  }

  const handleEditAccount = (accountId: string) => {
    navigate(`/admin/edit-account/${accountId}`)
  }

  const handleDeleteAccount = (account: Account) => {
    setDeleteAccount(account)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteAccount) {
      try {
        const response = await accountService.delete(deleteAccount.id)
        if (response.success) {
          toast.success(`Đã xóa tài khoản ${deleteAccount.username}`)
          fetchAccounts() // Refresh list
        }
      } catch (error) {
        console.error('Error deleting account:', error)
        toast.error('Không thể xóa tài khoản')
      }
    }
    setShowDeleteModal(false)
    setDeleteAccount(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteAccount(null)
  }

  // Filter accounts by role
  const adminAccounts = accounts.filter(acc => acc.role === 'admin')
  const staffAccounts = accounts.filter(acc => acc.role === 'staff')
  const agencyAccounts = accounts.filter(acc => acc.role === 'agency')

  const getFilteredAccounts = () => {
    switch (activeTab) {
      case 'all':
        return accounts
      case 'admin':
        return adminAccounts
      case 'staff':
        return staffAccounts
      case 'agency':
        return agencyAccounts
      default:
        return accounts
    }
  }

  const tabs = [
    { key: 'all' as TabType, label: 'Tất cả', icon: Users, count: accounts.length, color: '#6366f1' },
    { key: 'admin' as TabType, label: 'Quản trị viên', icon: ShieldCheck, count: adminAccounts.length, color: '#3b82f6' },
    { key: 'staff' as TabType, label: 'Nhân viên', icon: UserCog, count: staffAccounts.length, color: '#f59e0b' },
    { key: 'agency' as TabType, label: 'Đại lý', icon: Building2, count: agencyAccounts.length, color: '#10b981' },
  ]

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
      <div className="stats-cards-grid stats-cards-grid--three">
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
            onClick={() => navigate('/admin/add-account')}
          >
            <UserPlus size={20} />
            Thêm tài khoản
          </button>
        </div>

        {/* Tabs chia theo Role */}
        <div className="role-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`role-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              style={{ '--tab-color': tab.color } as React.CSSProperties}
            >
              <tab.icon size={20} />
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          ))}
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
                <th>TRẠNG THÁI</th>
                <th>NGÀY TẠO</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="empty-message">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : getFilteredAccounts().length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-message">
                    Không có tài khoản nào trong danh mục này.
                  </td>
                </tr>
              ) : (
                getFilteredAccounts().map((account) => (
                  <tr key={account.id}>
                    <td>
                      <span className="account-code">{account.code}</span>
                    </td>
                    <td>{account.username}</td>
                    <td>{account.fullName}</td>
                    <td className="text-muted">{account.email}</td>
                    <td className="text-muted">{account.phone}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xác nhận xóa tài khoản */}
      {showDeleteModal && deleteAccount && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content modal-delete-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-delete-modern-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="modal-delete-modern-title">Xác nhận xóa tài khoản</div>
            <div className="modal-delete-modern-desc">
              Bạn có chắc chắn muốn xóa tài khoản <b>{deleteAccount.username}</b>?
            </div>
            <div className="modal-delete-modern-warning">Hành động này không thể hoàn tác.</div>
            <div className="modal-delete-modern-actions">
              <button className="btn-modal-cancel-modern" onClick={handleCancelDelete}>Hủy</button>
              <button className="btn-modal-delete-modern" onClick={handleConfirmDelete}>Xóa tài khoản</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountManagement
