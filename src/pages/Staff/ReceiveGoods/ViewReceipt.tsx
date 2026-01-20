import { useNavigate, useParams } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import importService from '../../../api/endpoints/importService'
import './ViewReceipt.css'

interface ReceiptItem {
  id: number
  product: string
  unit: string
  quantity: number
  price: number
  total: number
}

const ViewReceipt = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [receipt, setReceipt] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReceipt()
  }, [id])

  const loadReceipt = async () => {
    try {
      setLoading(true)
      const response = await importService.getById(parseInt(id!))
      if (response.success && response.data) {
        const imp = response.data
        setReceipt({
          id: imp.id,
          code: imp.code,
          manufacturer: imp.agency_name || 'N/A',
          date: new Date(imp.created_at).toLocaleDateString('vi-VN'),
          status: imp.status,
          items: imp.products?.map((p: any) => ({
            id: p.product_id,
            product: p.product_name || 'N/A',
            unit: p.unit || '',
            quantity: p.quantity,
            price: p.price,
            total: p.quantity * p.price
          })) || [],
          total: imp.total_amount
        })
      }
    } catch (error) {
      console.error('Error loading receipt:', error)
      toast.error('Không thể tải chi tiết phiếu nhập')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="view-receipt-page"><p>Đang tải...</p></div>
  }

  if (!receipt) {
    return <div className="view-receipt-page"><p>Không tìm thấy phiếu nhập</p></div>
  }

  const handleBack = () => {
    navigate('/staff/receive-goods')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
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
    <div className="view-receipt-page">
      <div className="view-receipt-container">
        {/* Header */}
        <div className="view-receipt-header">
          <Package size={32} />
          <h1 className="view-receipt-title">Chi tiết phiếu nhập</h1>
          <button className="btn-back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Trở lại
          </button>
        </div>

        {/* Receipt Info */}
        <div className="view-receipt-content">
          {/* Info Section */}
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Mã phiếu nhập:</span>
              <span className="info-value">{receipt.code}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Nhà sản xuất:</span>
              <span className="info-value">{receipt.manufacturer}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Ngày tạo:</span>
              <span className="info-value">{receipt.date}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Trạng thái:</span>
              <span className={`status-badge ${getStatusClass(receipt.status)}`}>
                {getStatusLabel(receipt.status)}
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
                    <th className="col-quantity">Số lượng</th>
                    <th className="col-price">Đơn giá</th>
                    <th className="col-total">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item) => (
                    <tr key={item.id}>
                      <td className="col-product">{item.product}</td>
                      <td className="col-unit">{item.unit}</td>
                      <td className="col-quantity">{item.quantity}</td>
                      <td className="col-price">{formatCurrency(item.price)}</td>
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
            <span className="total-amount">{formatCurrency(receipt.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewReceipt



