import { Building2, Eye, Edit, Trash2, Search, TrendingUp, CreditCard, Filter, ArrowUpDown, ChevronDown, X, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import './AgencyManagement.css'

interface Staff {
  id: string
  name: string
  email: string
  phone: string
  agenciesCount: number
}

interface Agency {
  id: string
  code: string
  name: string
  address: string
  phone: string
  level: 1 | 2
  levelLabel: string
  totalSales: number
  debt: number
  debtLimit: number
  assignedStaffId?: string
  assignedStaffName?: string
}

const AgencyManagement = () => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteAgency, setDeleteAgency] = useState<Agency | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('none')
  
  // Custom dropdown states
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const levelDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)
  
  // Staff assignment modal states
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedAgencyForAssignment, setSelectedAgencyForAssignment] = useState<Agency | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string>('')
  
  // Mock staff data
  const [staffList] = useState<Staff[]>([
    { id: 's1', name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0912345678', agenciesCount: 1 },
    { id: 's2', name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0987654321', agenciesCount: 1 },
    { id: 's3', name: 'Lê Văn C', email: 'levanc@email.com', phone: '0901234567', agenciesCount: 0 },
    { id: 's4', name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0923456789', agenciesCount: 0 }
  ])
  
  // Level filter options
  const levelOptions = [
    { value: 'all', label: 'Tất cả cấp đại lý' },
    { value: '1', label: 'Cấp 1' },
    { value: '2', label: 'Cấp 2' }
  ]
  
  // Sort options
  const sortOptions = [
    { value: 'none', label: 'Sắp xếp theo' },
    { value: 'sales-desc', label: 'Doanh số (Cao → Thấp)' },
    { value: 'sales-asc', label: 'Doanh số (Thấp → Cao)' },
    { value: 'debt-desc', label: 'Công nợ (Cao → Thấp)' },
    { value: 'debt-asc', label: 'Công nợ (Thấp → Cao)' }
  ]
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
        setIsLevelDropdownOpen(false)
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Mock data
  const [agencies, setAgencies] = useState<Agency[]>([
    {
      id: '1',
      code: 'DL001',
      name: 'Đại lý Nghĩa',
      address: 'Số 1, Phố Tràng Tiền, Hoàn Kiếm, Hà Nội',
      phone: '02232434242',
      level: 1,
      levelLabel: 'Cấp 1',
      totalSales: 150000000,
      debt: 25000000,
      debtLimit: 50000000,
      assignedStaffId: 's1',
      assignedStaffName: 'Nguyễn Văn A'
    },
    {
      id: '2',
      code: 'DL002',
      name: 'Đại lý Đại',
      address: 'Số 2, Phố Đông Đa, Đông Đa, Hà Nội',
      phone: '02232434242',
      level: 1,
      levelLabel: 'Cấp 1',
      totalSales: 200000000,
      debt: 30000000,
      debtLimit: 50000000,
      assignedStaffId: 's2',
      assignedStaffName: 'Trần Thị B'
    },
    {
      id: '3',
      code: 'DL003',
      name: 'Đại lý An Khang',
      address: 'Số 3, Phố Hai Bà Trưng, Hoàn Kiếm, Hà Nội',
      phone: '0369852147',
      level: 2,
      levelLabel: 'Cấp 2',
      totalSales: 80000000,
      debt: 10000000,
      debtLimit: 30000000
    },
    {
      id: '4',
      code: 'DL004',
      name: 'Đại lý Minh Phát',
      address: 'Số 4, Phố Lê Thanh Tông, Hoan Kiếm, Hà Nội',
      phone: '0912345678',
      level: 2,
      levelLabel: 'Cấp 2',
      totalSales: 120000000,
      debt: 20000000,
      debtLimit: 30000000
    },
    {
      id: '5',
      code: 'DL005',
      name: 'Đại lý Thái Hà',
      address: 'Số 5, Phố Thái Hà, Đống Đa, Hà Nội',
      phone: '0901234567',
      level: 1,
      levelLabel: 'Cấp 1',
      totalSales: 300000000,
      debt: 45000000,
      debtLimit: 50000000
    }
  ])

  // Statistics calculations
  const totalAgencies = agencies.length
  const level1Agencies = agencies.filter(a => a.level === 1).length
  const level2Agencies = agencies.filter(a => a.level === 2).length
  const totalSales = agencies.reduce((sum, a) => sum + a.totalSales, 0)
  const totalDebt = agencies.reduce((sum, a) => sum + a.debt, 0)

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return (amount / 1000000000).toFixed(1) + ' tỷ'
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(0) + ' triệu'
    }
    return amount.toLocaleString('vi-VN') + 'đ'
  }

  const formatFullCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + 'đ'
  }

  // Filter and sort agencies
  const filteredAgencies = useMemo(() => {
    let result = [...agencies]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(a => 
        a.name.toLowerCase().includes(term) || 
        a.code.toLowerCase().includes(term) ||
        a.address.toLowerCase().includes(term)
      )
    }

    // Level filter
    if (levelFilter !== 'all') {
      result = result.filter(a => a.level === parseInt(levelFilter))
    }

    // Sort
    if (sortBy === 'sales-asc') {
      result.sort((a, b) => a.totalSales - b.totalSales)
    } else if (sortBy === 'sales-desc') {
      result.sort((a, b) => b.totalSales - a.totalSales)
    } else if (sortBy === 'debt-asc') {
      result.sort((a, b) => a.debt - b.debt)
    } else if (sortBy === 'debt-desc') {
      result.sort((a, b) => b.debt - a.debt)
    }

    return result
  }, [agencies, searchTerm, levelFilter, sortBy])

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

  const handleAssignStaff = () => {
    if (!selectedAgencyForAssignment || !selectedStaffId) {
      toast.error('Vui lòng chọn nhân viên')
      return
    }

    const selectedStaff = staffList.find(s => s.id === selectedStaffId)
    if (!selectedStaff) return

    // Check if staff already manages 2 agencies
    const staffAgenciesCount = agencies.filter(a => a.assignedStaffId === selectedStaffId).length
    if (staffAgenciesCount >= 2 && selectedAgencyForAssignment.assignedStaffId !== selectedStaffId) {
      toast.error('Nhân viên này đã quản lý 2 đại lý rồi')
      return
    }

    // Update agency with assigned staff
    setAgencies(prev => prev.map(a => 
      a.id === selectedAgencyForAssignment.id 
        ? { ...a, assignedStaffId: selectedStaffId, assignedStaffName: selectedStaff.name }
        : a
    ))

    toast.success(`Gán nhân viên ${selectedStaff.name} thành công!`)
    setShowAssignModal(false)
    setSelectedAgencyForAssignment(null)
    setSelectedStaffId('')
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
            Quản lý thông tin đại lý, doanh số và công nợ.
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
              <TrendingUp size={44} strokeWidth={2.5} />
              </div>
        </div>

        <div className="stats-card gradient-orange">
          <div className="stats-card-content">
            <div className="stats-label">Đại lý cấp 2</div>
            <div className="stats-value">{level2Agencies}</div>
          </div>
          <div className="stats-icon">
            <Users size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-green">
          <div className="stats-card-content">
            <div className="stats-label">Tổng doanh số nhập hàng</div>
            <div className="stats-value">{formatCurrency(totalSales)}</div>
          </div>
          <div className="stats-icon">
            <TrendingUp size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-orange">
          <div className="stats-card-content">
            <div className="stats-label">Tổng công nợ</div>
            <div className="stats-value">{formatCurrency(totalDebt)}</div>
          </div>
          <div className="stats-icon">
            <CreditCard size={44} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã đại lý..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters-group">
          {/* Custom Level Filter Dropdown */}
          <div 
            className={`custom-dropdown ${isLevelDropdownOpen ? 'open' : ''}`}
            ref={levelDropdownRef}
          >
            <div 
              className="dropdown-trigger"
              onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
            >
              <Filter size={16} />
              <span className="dropdown-value">
                {levelOptions.find(opt => opt.value === levelFilter)?.label}
              </span>
              <ChevronDown size={16} className="dropdown-arrow" />
            </div>
            {isLevelDropdownOpen && (
              <div className="dropdown-menu">
                {levelOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-option ${levelFilter === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      setLevelFilter(option.value)
                      setIsLevelDropdownOpen(false)
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Custom Sort Dropdown */}
          <div 
            className={`custom-dropdown ${isSortDropdownOpen ? 'open' : ''}`}
            ref={sortDropdownRef}
          >
            <div 
              className="dropdown-trigger"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <ArrowUpDown size={16} />
              <span className="dropdown-value">
                {sortOptions.find(opt => opt.value === sortBy)?.label}
              </span>
              <ChevronDown size={16} className="dropdown-arrow" />
            </div>
            {isSortDropdownOpen && (
              <div className="dropdown-menu">
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-option ${sortBy === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      setSortBy(option.value)
                      setIsSortDropdownOpen(false)
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agencies List Section */}
      <div className="agencies-section">
        <div className="section-header">
          <div className="header-left">
            <Building2 size={24} />
            <h2>Danh sách đại lý ({filteredAgencies.length})</h2>
          </div>
        </div>

        <div className="agencies-table-container">
          <table className="agencies-table">
            <thead>
              <tr>
                <th>MÃ ĐẠI LÝ</th>
                <th>TÊN ĐẠI LÝ</th>
                <th>ĐỊA CHỈ</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>CẤP ĐẠI LÝ</th>
                <th>DOANH SỐ NHẬP HÀNG</th>
                <th>CÔNG NỢ</th>
                <th>NHÂN VIÊN QL</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgencies.map((agency) => (
                <tr key={agency.id}>
                  <td>
                    <span className="agency-code">{agency.code}</span>
                  </td>
                  <td className="agency-name">{agency.name}</td>
                  <td className="text-muted">{agency.address}</td>
                  <td className="text-muted">{agency.phone}</td>
                  <td>
                    <span className={`level-badge level-${agency.level}`}>
                      {agency.levelLabel}
                    </span>
                  </td>
                  <td className="sales-cell">
                    <span className="sales-amount">{formatFullCurrency(agency.totalSales)}</span>
                  </td>
                  <td className="debt-cell">
                    <span className="debt-amount">{formatFullCurrency(agency.debt)}</span>
                    <span className="debt-limit">/ {formatFullCurrency(agency.debtLimit)}</span>
                  </td>
                  <td>
                    <div className="staff-assignment">
                      {agency.assignedStaffName ? (
                        <div className="staff-info">
                          <span className="staff-name">{agency.assignedStaffName}</span>
                          <button 
                            className="btn-assign-staff"
                            onClick={() => {
                              setSelectedAgencyForAssignment(agency)
                              setSelectedStaffId(agency.assignedStaffId || '')
                              setShowAssignModal(true)
                            }}
                            title="Thay đổi nhân viên"
                          >
                            Thay đổi
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn-assign-staff btn-assign-staff--empty"
                          onClick={() => {
                            setSelectedAgencyForAssignment(agency)
                            setSelectedStaffId('')
                            setShowAssignModal(true)
                          }}
                        >
                          + Gán nhân viên
                        </button>
                      )}
                    </div>
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
              {filteredAgencies.length === 0 && (
                <tr>
                  <td colSpan={9} className="empty-state">
                    <div className="empty-message">
                      <Search size={48} />
                      <p>Không tìm thấy đại lý nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Staff Modal */}
      {showAssignModal && selectedAgencyForAssignment && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content assign-staff-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gán nhân viên quản lý</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAssignModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="assign-info">
                <p><strong>Đại lý:</strong> {selectedAgencyForAssignment.code} - {selectedAgencyForAssignment.name}</p>
              </div>

              <div className="assign-form-group">
                <label>Chọn nhân viên quản lý: <span className="required">*</span></label>
                <select 
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="assign-form-select"
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {staffList.map(staff => {
                    const isAssignedToOther = staff.id !== selectedAgencyForAssignment.assignedStaffId && staff.agenciesCount >= 2
                    return (
                      <option 
                        key={staff.id} 
                        value={staff.id}
                        disabled={isAssignedToOther}
                      >
                        {staff.name} ({staff.agenciesCount}/2 đại lý)
                        {isAssignedToOther && ' - Đã đủ'}
                      </option>
                    )
                  })}
                </select>
              </div>

              {selectedStaffId && (
                <div className="staff-details">
                  {staffList.find(s => s.id === selectedStaffId) && (
                    <>
                      <p><strong>Email:</strong> {staffList.find(s => s.id === selectedStaffId)?.email}</p>
                      <p><strong>Số điện thoại:</strong> {staffList.find(s => s.id === selectedStaffId)?.phone}</p>
                      <p><strong>Đang quản lý:</strong> {staffList.find(s => s.id === selectedStaffId)?.agenciesCount}/2 đại lý</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel"
                onClick={() => setShowAssignModal(false)}
              >
                Hủy
              </button>
              <button 
                className="btn-confirm"
                onClick={handleAssignStaff}
              >
                Gán nhân viên
              </button>
            </div>
          </div>
        </div>
      )}

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
