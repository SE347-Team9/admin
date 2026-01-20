import { useNavigate } from 'react-router-dom';
import { Box, Calendar, User, ArrowLeft, Activity } from 'lucide-react';
import './ViewImport.css';

const importData = {
  id: 4,
  code: '#4',
  date: '2024-05-04',
  creator: 'ST',
  status: 'completed',
  statusLabel: 'completed',
  supplier: 'Công ty TNHH ABC',
  items: [
    { name: 'Gạo ST25', quantity: 60, price: 25000, total: 1500000, unit: '' },
    { name: 'Nước ngọt Pepsi', quantity: 100, price: 9000, total: 900000, unit: '' },
    { name: 'Snack Oishi', quantity: 50, price: 12000, total: 600000, unit: '' },
  ],
};

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VND';

const ViewImport = () => {
  const navigate = useNavigate();
  const total = importData.items.reduce((sum, i) => sum + i.total, 0);
  const totalProducts = importData.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="view-import-wrapper">
      <div className="view-import-header">
        <div className="view-import-header-icon"><Box size={36} /></div>
        <div className="view-import-header-content">
          <h1 className="view-import-title">Chi tiết Phiếu Nhập</h1>
          <p className="view-import-desc">Thông tin chi tiết phiếu nhập mã <b>{importData.code}</b></p>
        </div>
        <button className="view-import-back-btn" onClick={() => navigate('/staff/receive-goods')}>
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>
      <div className="view-import-main">
        <div className="view-import-section">
          <h2 className="view-import-section-title">Thông tin chung</h2>
          <div className="view-import-info-row">
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><Box size={20} /></span>
              <div>
                <div className="view-import-info-label">Mã phiếu nhập</div>
                <div className="view-import-info-value">{importData.code}</div>
              </div>
            </div>
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><Calendar size={20} /></span>
              <div>
                <div className="view-import-info-label">Ngày lập phiếu</div>
                <div className="view-import-info-value">{importData.date.split('-').reverse().join('/')}</div>
              </div>
            </div>
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><User size={20} /></span>
              <div>
                <div className="view-import-info-label">Người tạo</div>
                <div className="view-import-info-value">{importData.creator}</div>
              </div>
            </div>
            <div className="view-import-info-block">
              <span className="view-import-info-icon"><Activity size={20} /></span>
              <div>
                <div className="view-import-info-label">Trạng thái</div>
                <span className="view-import-status-badge view-import-status-badge--completed">{importData.statusLabel}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="view-import-section">
          <div className="view-import-section-title-row">
            <h2 className="view-import-section-title">Danh sách sản phẩm</h2>
            <span className="view-import-section-total">Tổng: {totalProducts} sản phẩm</span>
          </div>
          <div className="view-import-table-section">
            <table className="view-import-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mặt hàng</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {importData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td className="view-import-money">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="view-import-total-box">
          <div className="view-import-total-label">Tổng cộng</div>
          <div className="view-import-total-value">{total.toLocaleString('vi-VN')}.00 <span>VND</span></div>
          <div className="view-import-total-supplier">Nhà cung cấp: <span>{importData.supplier}</span></div>
          <div className="view-import-total-count">{importData.items.length} sản phẩm</div>
        </div>
      </div>
    </div>
  );
};

export default ViewImport;



