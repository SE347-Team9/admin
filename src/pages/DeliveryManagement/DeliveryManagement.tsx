import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Truck, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  CheckCircle2, 
  XCircle,
  Phone,
  MapPin,
  Bike,
  Car
} from 'lucide-react'
import { toast } from 'react-toastify'
import './DeliveryManagement.css'

interface Driver {
  id: string
  code: string
  fullName: string
  phone: string
  idCard: string
  vehicleType: 'motorcycle' | 'truck_small' | 'truck_medium' | 'truck_large'
  vehicleTypeLabel: string
  licensePlate: string
  areas: string[]
  status: 'available' | 'delivering' | 'off'
  statusLabel: string
  totalDeliveries: number
  createdAt: string
}

const DeliveryManagement = () => {
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteDriver, setDeleteDriver] = useState<Driver | null>(null)

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      code: 'TX001',
      fullName: 'Nguyễn Văn Hùng',
      phone: '0901234567',
      idCard: '079201012345',
      vehicleType: 'truck_medium',
      vehicleTypeLabel: 'Xe tải 2.5T',
      licensePlate: '51C-12345',
      areas: ['Quận 1', 'Quận 3', 'Quận 5'],
      status: 'available',
      statusLabel: 'Sẵn sàng',
      totalDeliveries: 156,
      createdAt: '15/03/2024'
    },
    {
      id: '2',
      code: 'TX002',
      fullName: 'Trần Văn Dũng',
      phone: '0912345678',
      idCard: '079201023456',
      vehicleType: 'truck_large',
      vehicleTypeLabel: 'Xe tải 5T',
      licensePlate: '51C-67890',
      areas: ['Quận 7', 'Quận 8', 'Bình Chánh'],
      status: 'delivering',
      statusLabel: 'Đang giao hàng',
      totalDeliveries: 203,
      createdAt: '20/02/2024'
    },
    {
      id: '3',
      code: 'TX003',
      fullName: 'Lê Minh Tuấn',
      phone: '0923456789',
      idCard: '079201034567',
      vehicleType: 'motorcycle',
      vehicleTypeLabel: 'Xe máy',
      licensePlate: '59P1-23456',
      areas: ['Quận 1', 'Quận 3'],
      status: 'available',
      statusLabel: 'Sẵn sàng',
      totalDeliveries: 89,
      createdAt: '10/04/2024'
    },
    {
      id: '4',
      code: 'TX004',
      fullName: 'Phạm Văn Thành',
      phone: '0934567890',
      idCard: '079201045678',
      vehicleType: 'truck_small',
      vehicleTypeLabel: 'Xe tải 1T',
      licensePlate: '51C-11111',
      areas: ['Quận 10', 'Quận 11', 'Tân Bình'],
      status: 'off',
      statusLabel: 'Nghỉ phép',
      totalDeliveries: 124,
      createdAt: '05/01/2024'
    }
  ])

  const totalDrivers = drivers.length
  const availableDrivers = drivers.filter(d => d.status === 'available').length
  const deliveringDrivers = drivers.filter(d => d.status === 'delivering').length
  const offDrivers = drivers.filter(d => d.status === 'off').length

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available': return 'status-available'
      case 'delivering': return 'status-delivering'
      case 'off': return 'status-off'
      default: return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle2 size={14} />
      case 'delivering': return <Truck size={14} />
      case 'off': return <XCircle size={14} />
      default: return <CheckCircle2 size={14} />
    }
  }

  const getVehicleIcon = (type: string) => {
    return type === 'motorcycle' ? <Bike size={16} /> : <Car size={16} />
  }

  const handleDeleteDriver = (driver: Driver) => {
    setDeleteDriver(driver)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteDriver) {
      setDrivers(prev => prev.filter(d => d.id !== deleteDriver.id))
      toast.success(`Đã xóa tài xế ${deleteDriver.fullName}`)
    }
    setShowDeleteModal(false)
    setDeleteDriver(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteDriver(null)
  }

  return (
    <div className="delivery-management-page">
      <div className="delivery-header">
        <div className="header-icon-box">
          <Truck size={36} />
        </div>
        <div className="header-text">
          <h1 className="delivery-title">Quản lý giao hàng</h1>
          <p className="delivery-subtitle">
            Quản lý tài xế, phương tiện và theo dõi các chuyến giao hàng trong hệ thống.
          </p>
        </div>
      </div>

      <div className="stats-cards-grid">
        <div className="stats-card gradient-blue">
          <div className="stats-card-content">
            <div className="stats-label">Tổng tài xế</div>
            <div className="stats-value">{totalDrivers}</div>
          </div>
          <div className="stats-icon">
            <Truck size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-green">
          <div className="stats-card-content">
            <div className="stats-label">Sẵn sàng</div>
            <div className="stats-value">{availableDrivers}</div>
          </div>
          <div className="stats-icon">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-orange">
          <div className="stats-card-content">
            <div className="stats-label">Đang giao hàng</div>
            <div className="stats-value">{deliveringDrivers}</div>
          </div>
          <div className="stats-icon">
            <Truck size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-gray">
          <div className="stats-card-content">
            <div className="stats-label">Nghỉ phép</div>
            <div className="stats-value">{offDrivers}</div>
          </div>
          <div className="stats-icon">
            <XCircle size={44} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      <div className="drivers-section">
        <div className="section-header">
          <div className="header-left">
            <Truck size={24} />
            <h2>Danh sách tài xế ({drivers.length})</h2>
          </div>
          <button 
            className="btn-create-driver"
            onClick={() => navigate('/add-driver')}
          >
            <UserPlus size={20} />
            Thêm tài xế
          </button>
        </div>

        <div className="drivers-table-container">
          <table className="drivers-table">
            <thead>
              <tr>
                <th>MÃ</th>
                <th>HỌ TÊN</th>
                <th>ĐIỆN THOẠI</th>
                <th>XE</th>
                <th>BIỂN SỐ</th>
                <th>KHU VỰC</th>
                <th className="text-center">CHUYẾN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>
                    <span className="driver-code">{driver.code}</span>
                  </td>
                  <td>
                    <div className="driver-name">{driver.fullName}</div>
                  </td>
                  <td>
                    <span className="driver-phone">{driver.phone}</span>
                  </td>
                  <td>
                    <span className="vehicle-info">{driver.vehicleTypeLabel}</span>
                  </td>
                  <td>
                    <span className="license-plate">{driver.licensePlate}</span>
                  </td>
                  <td>
                    <div className="areas-tags">
                      {driver.areas.slice(0, 2).map((area, idx) => (
                        <span key={idx} className="area-tag">{area}</span>
                      ))}
                      {driver.areas.length > 2 && (
                        <span className="area-tag more">+{driver.areas.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="delivery-count">{driver.totalDeliveries}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(driver.status)}`}>
                      {driver.statusLabel}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon btn-view" 
                        title="Xem chi tiết"
                        onClick={() => navigate(`/view-driver/${driver.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-edit" 
                        title="Chỉnh sửa"
                        onClick={() => navigate(`/edit-driver/${driver.id}`)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        title="Xóa"
                        onClick={() => handleDeleteDriver(driver)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && deleteDriver && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content modal-delete-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-delete-modern-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="modal-delete-modern-title">Xác nhận xóa tài xế</div>
            <div className="modal-delete-modern-desc">
              Bạn có chắc chắn muốn xóa tài xế <b>{deleteDriver.fullName}</b>?
            </div>
            <div className="modal-delete-modern-warning">
              Tài xế đã thực hiện {deleteDriver.totalDeliveries} chuyến giao hàng. Hành động này không thể hoàn tác.
            </div>
            <div className="modal-delete-modern-actions">
              <button className="btn-modal-cancel-modern" onClick={handleCancelDelete}>Hủy</button>
              <button className="btn-modal-delete-modern" onClick={handleConfirmDelete}>Xóa tài xế</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryManagement
