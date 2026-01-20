
import { FileText, ClipboardList, Package2, ShoppingCart, Calendar, DollarSign, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import importService, { Import } from '../../../api/endpoints/importService'
import './ReceiveGoods.css'

const ReceiveGoods = () => {
  const navigate = useNavigate();
  const [importRecords, setImportRecords] = useState<Import[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImports();
  }, []);

  const loadImports = async () => {
    try {
      setLoading(true);
      const response = await importService.getAll();
      if (response.success && response.data) {
        setImportRecords(response.data);
      }
    } catch (error) {
      console.error('Error loading imports:', error);
      toast.error('Không thể tải danh sách nhập hàng');
    } finally {
      setLoading(false);
    }
  };

  const totalImports = importRecords.length
  const totalValue = importRecords.reduce((sum, record) => sum + (record.total_amount || 0), 0)

  if (loading) {
    return (
      <div className="receive-goods">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received':
        return 'Đã nhận'
      case 'pending':
        return 'Chờ nhận'
      case 'cancelled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'received':
        return 'status-delivered'
      case 'pending':
        return 'status-pending'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return ''
    }
  }

  return (
    <div className="receive-goods">
      {/* Header */}
      <div className="receive-header">
        <div className="header-icon-box">
          <ClipboardList size={36} />
        </div>
        <div className="header-text">
          <h1 className="receive-title">Lịch Sử Nhận Hàng</h1>
          <p className="receive-subtitle">
            Lịch sử các phiếu nhận hàng cho đại lý của bạn.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="receive-stat-card stat-blue">
          <div className="stat-icon-wrapper blue">
            <Package2 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng Số Phiếu Nhận Hàng</div>
            <div className="stat-value">{totalImports}</div>
          </div>
        </div>

        <div className="receive-stat-card stat-green">
          <div className="stat-icon-wrapper green">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Tổng Giá Trị Nhập Hàng</div>
            <div className="stat-value">{totalValue.toLocaleString('vi-VN')} VND</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <div className="th-content">
                  <FileText size={16} />
                  <span>MÃ PHIẾU NHẬN</span>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <Calendar size={16} />
                  <span>NGÀY GIAO HÀNG</span>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <Calendar size={16} />
                  <span>NGÀY NHẬN HÀNG</span>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <Package2 size={16} />
                  <span>SỐ MẶT HÀNG</span>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <DollarSign size={16} />
                  <span>TỔNG GIÁ TRỊ</span>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <span>TRẠNG THÁI</span>
                </div>
              </th>
              <th>
                <div className="th-content">
                  <MoreVertical size={16} />
                  <span>THAO TÁC</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {importRecords.map((record) => (
              <tr key={record.id}>
                <td>
                  <span className="record-code">{record.code}</span>
                </td>
                <td className="text-center">{record.ship_date ? new Date(record.ship_date).toLocaleDateString('vi-VN') : 'N/A'}</td>
                <td className="text-center">{record.receive_date ? new Date(record.receive_date).toLocaleDateString('vi-VN') : 'N/A'}</td>
                <td className="text-center">{record.products?.length || 0}</td>
                <td>
                  <span className="amount">{record.total_amount.toLocaleString('vi-VN')} VND</span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(record.status)}`}>
                    {getStatusText(record.status)}
                  </span>
                </td>
                <td>
                  <button className="action-btn" onClick={() => navigate(`/agency/view-receive/${record.code}`)}>
                    <FileText size={16} />
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReceiveGoods

