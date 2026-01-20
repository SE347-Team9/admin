import { useParams, useNavigate } from 'react-router-dom'
import { 
  Truck, 
  ArrowLeft, 
  Edit,
  Phone,
  CreditCard,
  Car,
  MapPin,
  Calendar,
  CheckCircle2,
  Package
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import driverService from '../../api/endpoints/driverService'
import './ViewDriver.css'

const ViewDriver = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [driver, setDriver] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDriver()
  }, [id])

  const loadDriver = async () => {
    try {
      setLoading(true)
      const response = await driverService.getById(id!)
      if (response.success && response.data) {
        const d = response.data
        setDriver({
          id: d.id,
          code: d.code,
          fullName: d.fullName,
          phone: d.phone,
          idCard: d.idCard || 'N/A',
          vehicleType: d.vehicleType,
          vehicleTypeLabel: d.vehicleType === 'truck_medium' ? 'Xe tải 2.5T' : 'Xe tải',
          licensePlate: d.licensePlate,
          areas: d.areas || [],
          status: d.status,
          statusLabel: d.status === 'available' ? 'Sẵn sàng' : 'Bận',
          totalDeliveries: 0,
          createdAt: new Date(d.createdAt).toLocaleDateString('vi-VN'),
          address: 'N/A',
          birthDate: 'N/A',
          licenseType: 'B2'
        })
      }
    } catch (error) {
      console.error('Error loading driver:', error)
      toast.error('Không thể tải thông tin tài xế')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="view-driver-page"><p>Đang tải...</p></div>
  }

  if (!driver) {
    return <div className="view-driver-page"><p>Không tìm thấy tài xế</p></div>
  }

  const recentDeliveries = [
    { id: 'CG001', date: '08/01/2026', agencies: 5, status: 'completed', value: '45.000.000 VNĐ' },
    { id: 'CG002', date: '07/01/2026', agencies: 3, status: 'completed', value: '28.500.000 VNĐ' },
    { id: 'CG003', date: '06/01/2026', agencies: 4, status: 'completed', value: '36.200.000 VNĐ' },
  ]

  return (
    <div className="view-driver-page">
      <div className="view-driver-header">
        <button className="btn-back" onClick={() => navigate('/admin/delivery-management')}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
        <div className="header-content">
          <div className="header-icon-box">
            <Truck size={36} />
          </div>
          <div className="header-text">
            <div className="header-title-row">
              <h1 className="view-driver-title">Thông tin tài xế</h1>
              <span className={`status-badge status-${driver.status}`}>
                <CheckCircle2 size={14} />
                {driver.statusLabel}
              </span>
            </div>
            <p className="view-driver-subtitle">
              Mã tài xế: <strong>{driver.code}</strong>
            </p>
          </div>
          <button className="btn-edit" onClick={() => navigate(`/edit-driver/${id}`)}>
            <Edit size={18} />
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="view-driver-content">
        <div className="info-grid">
          {/* Personal Info Card */}
          <div className="info-card">
            <h3 className="card-title">Thông tin cá nhân</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Họ và tên</span>
                <span className="info-value">{driver.fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <Phone size={14} />
                  Số điện thoại
                </span>
                <span className="info-value">{driver.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <CreditCard size={14} />
                  Số CCCD
                </span>
                <span className="info-value">{driver.idCard}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <Calendar size={14} />
                  Ngày tham gia
                </span>
                <span className="info-value">{driver.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Info Card */}
          <div className="info-card">
            <h3 className="card-title">Thông tin phương tiện</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">
                  <Car size={14} />
                  Loại phương tiện
                </span>
                <span className="info-value">{driver.vehicleTypeLabel}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Biển số xe</span>
                <span className="info-value license-plate">{driver.licensePlate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Hạng bằng lái</span>
                <span className="info-value">{driver.licenseType}</span>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="info-card stats-card">
            <h3 className="card-title">Thống kê</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{driver.totalDeliveries}</div>
                <div className="stat-label">Chuyến đã giao</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{driver.areas.length}</div>
                <div className="stat-label">Khu vực phụ trách</div>
              </div>
            </div>
          </div>

          {/* Areas Card */}
          <div className="info-card areas-card">
            <h3 className="card-title">
              <MapPin size={18} />
              Khu vực phụ trách
            </h3>
            <div className="areas-list">
              {driver.areas.map((area, idx) => (
                <span key={idx} className="area-tag">
                  <MapPin size={14} />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="recent-deliveries">
          <h3 className="section-title">
            <Package size={20} />
            Chuyến giao gần đây
          </h3>
          <table className="deliveries-table">
            <thead>
              <tr>
                <th>Mã chuyến</th>
                <th>Ngày</th>
                <th>Số đại lý</th>
                <th>Giá trị</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map(delivery => (
                <tr key={delivery.id}>
                  <td><span className="delivery-code">{delivery.id}</span></td>
                  <td>{delivery.date}</td>
                  <td>{delivery.agencies} đại lý</td>
                  <td className="delivery-value">{delivery.value}</td>
                  <td>
                    <span className="status-badge status-completed">
                      <CheckCircle2 size={14} />
                      Hoàn thành
                    </span>
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

export default ViewDriver
