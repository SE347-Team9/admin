import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { DollarSign, Search, Edit, Trash2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import paymentService, { Payment } from '../../../api/endpoints/paymentService'
import './PaymentManagement.css'

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  const [payments, setPayments] = useState<Payment[]>([])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const response = await paymentService.getAll()
      if (response.success && response.data) {
        setPayments(response.data)
      }
    } catch (error) {
      console.error('Error loading payments:', error)
      toast.error('Không thể tải danh sách phiếu thu')
    } finally {
      setLoading(false)
    }
  }

  // Load payments on mount and when location changes
  useEffect(() => {
    if (location.pathname === '/payment-management' || location.pathname === '/staff/payment-management') {
      loadPayments()
    }
  }, [location.pathname])

  // Also load on component mount
  useEffect(() => {
    loadPayments()
  }, [])

  useEffect(() => {
    loadPayments()
  }, [])

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      loadPayments()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Listen for custom event to update payments
  useEffect(() => {
    const handlePaymentsUpdated = () => {
      loadPayments()
    }
    window.addEventListener('paymentsUpdated', handlePaymentsUpdated)
    return () => window.removeEventListener('paymentsUpdated', handlePaymentsUpdated)
  }, [])

  const totalPayments = payments.length
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)

  const filteredPayments = payments.filter(payment =>
    payment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.agency_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleEdit = (id: string) => {
    navigate(`/payment/edit/${id}`);
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePayment, setDeletePayment] = useState<Payment | null>(null);

  const handleDelete = async (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (!payment) return;
    
    setDeletePayment(payment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletePayment) {
      try {
        const response = await paymentService.cancel(deletePayment.id, 'Xóa bởi nhân viên')
        if (response.success) {
          toast.success('Đã hủy phiếu thu thành công!')
          loadPayments() // Reload list
        }
      } catch (error) {
        console.error('Error canceling payment:', error)
        toast.error('Không thể hủy phiếu thu')
      }
    }
    setShowDeleteModal(false);
    setDeletePayment(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletePayment(null);
  };

  const formatDateDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xác nhận';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  if (loading) {
    return (
      <div className="payment-management-page">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="payment-management-page">
      {/* Header Section */}
      <div className="payment-management__header">
        <div className="payment-management__header-icon">
          <DollarSign size={36} />
        </div>
        <div className="payment-management__header-text">
          <h1 className="payment-management__title">Phiếu Thu Của Tôi</h1>
        </div>
        <div className="payment-management__header-actions"></div>
      </div>

      {/* Statistics Cards */}
      <div className="payment-management__stats-grid">
        <div className="payment-management__stat-card payment-management__stat-card--blue">
          <div className="payment-management__stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="payment-management__stat-content">
            <div className="payment-management__stat-label">Tổng phiếu thu</div>
            <div className="payment-management__stat-value">{totalPayments}</div>
          </div>
        </div>

        <div className="payment-management__stat-card payment-management__stat-card--green">
          <div className="payment-management__stat-icon">
            <span className="payment-management__currency-icon">₫</span>
          </div>
          <div className="payment-management__stat-content">
            <div className="payment-management__stat-label">Tổng số tiền</div>
            <div className="payment-management__stat-value">{(totalAmount / 1000000).toFixed(2)}M</div>
          </div>
        </div>
      </div>

      {/* Payments Table Section */}
      <div className="payment-management__table-section">
        <div className="payment-management__search-wrapper">
          <Search className="payment-management__search-icon" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã phiếu, ngày thu..."
            className="payment-management__search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="payment-management__table-wrapper">
          <table className="payment-management__table">
            <thead>
              <tr>
                <th>
                  <span>
                    <DollarSign size={18} />
                    <span>MÃ PHIẾU</span>
                  </span>
                </th>
                <th>NGÀY THU</th>
                <th>ĐẠI LÝ</th>
                <th>SỐ TIỀN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="payment-management__receipt-code">
                        <DollarSign size={16} />
                        <span>{payment.code}</span>
                      </div>
                    </td>
                    <td>{formatDateDisplay(payment.created_at)}</td>
                    <td>
                      <div className="payment-management__agency-name">
                        {payment.agency_name || payment.agency_code}
                      </div>
                    </td>
                    <td>
                      <span className="payment-management__amount">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>
                    <td>
                      <span className={`payment-status-badge payment-status-${payment.status}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td>
                      <div className="payment-management__action-buttons">
                        <button
                          className="payment-management__action-btn payment-management__action-btn--edit"
                          onClick={() => handleEdit(payment.id)}
                          title="Sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="payment-management__action-btn payment-management__action-btn--delete"
                          onClick={() => handleDelete(payment.id)}
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="payment-management__no-data">
                    <DollarSign size={48} />
                    <p>Không tìm thấy phiếu thu nào</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Popup xác nhận xóa phiếu thu */}
      {showDeleteModal && deletePayment && (
        <div className="payment-management__modal-overlay" onClick={handleCancelDelete}>
          <div className="payment-management__modal-delete" onClick={e => e.stopPropagation()}>
            <div className="payment-management__modal-delete-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="payment-management__modal-delete-title">Xác nhận xóa phiếu thu?</div>
            <div className="payment-management__modal-delete-desc">Bạn có chắc chắn muốn xóa phiếu thu <b>{deletePayment.code}</b> không?</div>
            <div className="payment-management__modal-delete-warning">Hành động này không thể hoàn tác!</div>
            <div className="payment-management__modal-delete-actions">
              <button className="payment-management__modal-delete-cancel" onClick={handleCancelDelete}>Hủy</button>
              <button className="payment-management__modal-delete-confirm" onClick={handleConfirmDelete}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentManagement



