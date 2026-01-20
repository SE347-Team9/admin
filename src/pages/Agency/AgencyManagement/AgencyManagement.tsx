import { useState, useEffect } from 'react'
import { User, Building2, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react'
import authService from '../../../api/endpoints/authService'
import agencyService from '../../../api/endpoints/agencyService'
import { toast } from 'react-toastify'
import './AgencyManagement.css'

const AgencyManagement = () => {
  const [agencyInfo, setAgencyInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const currentUser = authService.getCurrentUser()

  useEffect(() => {
    fetchAgencyInfo()
  }, [])

  const fetchAgencyInfo = async () => {
    try {
      setLoading(true)
      // Get agency ID from current user token
      const agencyId = currentUser?.agencyId
      
      if (!agencyId) {
        toast.error('Không tìm thấy ID đại lý. Vui lòng đăng nhập lại.')
        setLoading(false)
        return
      }
      
      const response = await agencyService.getById(agencyId)
      if (response.success) {
        setAgencyInfo(response.data)
      } else {
        toast.error('Không thể tải thông tin đại lý')
      }
    } catch (error) {
      console.error('Error fetching agency info:', error)
      toast.error('Không thể tải thông tin đại lý')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="agency-management"><p>Đang tải...</p></div>
  }

  if (!agencyInfo) {
    return <div className="agency-management"><p>Không tìm thấy thông tin đại lý</p></div>
  }

  const userInfo = {
    name: currentUser?.username || agencyInfo.name || 'Người dùng',
    userId: currentUser?.id || 0,
    agencyId: agencyInfo.id
  }

  const accountInfo = {
    username: currentUser?.username || '',
    email: agencyInfo.email || '',
    phone: agencyInfo.phone || '',
    address: agencyInfo.address || '',
    role: 'agent'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const displayAgencyInfo = {
    name: agencyInfo.name,
    code: agencyInfo.code,
    type: 'Đại lý',
    email: agencyInfo.email || '',
    address: agencyInfo.address || '',
    phone: agencyInfo.phone || '',
    creditLimit: formatCurrency(agencyInfo.credit_limit || agencyInfo.creditLimit || 50000000),
    currentDebt: formatCurrency(agencyInfo.current_debt || agencyInfo.currentDebt || 0),
    status: agencyInfo.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'
  }

  return (
    <div className="agency-management">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <User size={64} />
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{userInfo.name}</h1>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        <div className="profile-info-card">
          <div className="card-header">
            <Building2 size={20} />
            <h2>HỒ SƠ ĐẠI LÝ</h2>
          </div>
          
          <div className="card-body">
            <div className="info-row">
              <div className="info-field">
                <label>
                  <User size={16} />
                  Tên đăng nhập
                </label>
                <div className="info-value">{accountInfo.username}</div>
              </div>
              <div className="info-field">
                <label>
                  <Building2 size={16} />
                  Tên đại lý
                </label>
                <div className="info-value">{displayAgencyInfo.name}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-field">
                <label>
                  <span className="icon-tag">T</span>
                  Loại đại lý
                </label>
                <div className="info-value">{displayAgencyInfo.type}</div>
              </div>
              <div className="info-field">
                <label>
                  <Mail size={16} />
                  Email
                </label>
                <div className="info-value">{displayAgencyInfo.email}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-field">
                <label>
                  <MapPin size={16} />
                  Địa chỉ
                </label>
                <div className="info-value">{displayAgencyInfo.address}</div>
              </div>
              <div className="info-field">
                <label>
                  <Phone size={16} />
                  Số điện thoại
                </label>
                <div className="info-value">{displayAgencyInfo.phone}</div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-field">
                <label>
                  <span className="icon-code">{'<>'}</span>
                  Mã đại lý
                </label>
                <div className="info-value info-value-highlight">{displayAgencyInfo.code}</div>
              </div>
              <div className="info-field">
                <label>
                  <CheckCircle2 size={16} />
                  Trạng thái
                </label>
                <div className="status-badge status-active">
                  <CheckCircle2 size={16} />
                  {displayAgencyInfo.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgencyManagement



