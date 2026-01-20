import { useNavigate, useParams } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import importService from '../../../api/endpoints/importService'
import './ViewReceiveOrder.css'

interface ReceiveOrderItem {
  id: number
  product: string
  unit: string
  warehouse: string
  quantity: number
  price: number
  mfgDate: string
  expDate: string
  total: number
}

const ViewReceiveOrder = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [receiveOrder, setReceiveOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReceiveOrder()
  }, [id])

  const loadReceiveOrder = async () => {
    try {
      setLoading(true)
      const response = await importService.getById(parseInt(id!))
      if (response.success && response.data) {
        const imp = response.data
        setReceiveOrder({
          id: imp.id,
          code: imp.code,
          manufacturer: imp.agency_name || 'N/A',
          date: new Date(imp.created_at).toLocaleDateString('vi-VN'),
          status: imp.status,
          items: imp.products?.map((p: any) => ({
            id: p.product_id,
            product: p.product_name || 'N/A',
            unit: p.unit || '',
            warehouse: 'Kho thường',
            quantity: p.quantity,
            price: p.price,
            mfgDate: '2024-01-01',
            expDate: '2025-01-01',
            total: p.quantity * p.price
          })) || [],
          total: imp.total_amount
        })
      }
    } catch (error) {
      console.error('Error loading receive order:', error)
      toast.error('Không thể tải chi tiết phiếu nhận')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="view-receive-order-page"><p>Đang tải...</p></div>
  }

  if (!receiveOrder) {
    return <div className="view-receive-order-page"><p>Không tìm thấy phiếu nhận</p></div>
  }

  const handleBack = () => {
    navigate('/staff/receive-management')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt'
      case 'pending':
        return 'Chờ duyệt'
      case 'rejected':
        return 'Từ chối'
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'status-approved'
      case 'pending':
        return 'status-pending'
      case 'rejected':
        return 'status-rejected'
      default:
        return ''
    }
  }

  return (
    <div className="view-receive-order-page">
      <div className="view-receive-order-container">
        {/* Header */}
        <div className="view-receive-order-header">
          <Package size={32} />
          <h1 className="view-receive-order-title">Chi tiết phiếu nhận</h1>
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Trở lại
          </button>
        </div>

        {/* Receipt Info */}
        <div className="view-receive-order-content">
          {/* Info Section */}
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Mã phiếu nhận:</span>
              <span className="info-value">{receiveOrder.code}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nhà sản xuất:</span>
              <span className="info-value">{receiveOrder.manufacturer}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày tạo:</span>
              <span className="info-value">{receiveOrder.date}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Trạng thái:</span>
              <span className={`status-badge ${getStatusClass(receiveOrder.status)}`}>
                {getStatusLabel(receiveOrder.status)}
              </span>
            </div>
          </div>

          {/* Products Table */}
          <div className="products-section">
            <h3 className="section-title">Danh sách sản phẩm</h3>

            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="col-product">Sản phẩm</th>
                    <th className="col-unit">Đơn vị</th>
                    <th className="col-warehouse">Kho</th>
                    <th className="col-quantity">Số lượng</th>
                    <th className="col-price">Đơn giá</th>
                    <th className="col-date">NSX</th>
                    <th className="col-date">HSD</th>
                    <th className="col-total">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {receiveOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="col-product">{item.product}</td>
                      <td className="col-unit">{item.unit}</td>
                      <td className="col-warehouse">{item.warehouse}</td>
                      <td className="col-quantity">{item.quantity}</td>
                      <td className="col-price">{formatCurrency(item.price)}</td>
                      <td className="col-date">{formatDate(item.mfgDate)}</td>
                      <td className="col-date">{formatDate(item.expDate)}</td>
                      <td className="col-total">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="total-section">
            <span className="total-label">Tổng tiền:</span>
            <span className="total-amount">{formatCurrency(receiveOrder.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewReceiveOrder



