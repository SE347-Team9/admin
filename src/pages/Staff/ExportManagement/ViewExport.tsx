import { useNavigate } from 'react-router-dom';
import './ViewExport.css';

const exportData = {
  code: 'PX002',
  agency: 'Đại lý Đại',
  date: '11/5/2024',
  items: [
    { name: 'Nước ngọt Pepsi', unit: 'chai', quantity: 80, batch: 'LO-20260110', price: 9000 },
    { name: 'Sữa Vinamilk', unit: 'hộp', quantity: 3, batch: 'LO-20260110', price: 60000 },
  ],
};

const formatCurrency = (amount: number) =>
  amount.toLocaleString('vi-VN') + ' đ';

const ViewExport = () => {
  const navigate = useNavigate();
  const total = exportData.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="view-export-wrapper">
      <div className="view-export-card">
        <h1 className="view-export-title">CHI TIẾT PHIẾU XUẤT</h1>
        <button className="view-export-back-btn" onClick={() => navigate('/staff/export-management')}>
          ← Quay lại
        </button>
        <div className="view-export-info-grid">
          <div>
            <label className="view-export-label">Mã phiếu xuất</label>
            <input className="view-export-input" value={exportData.code} readOnly />
          </div>
          <div>
            <label className="view-export-label">Đại lý</label>
            <input className="view-export-input" value={exportData.agency} readOnly />
          </div>
          <div style={{gridColumn: '1/3'}}>
            <label className="view-export-label">Ngày lập phiếu</label>
            <input className="view-export-input" value={exportData.date} readOnly />
          </div>
        </div>
        <div className="view-export-table-section">
          <table className="view-export-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>MẶT HÀNG</th>
                <th>ĐƠN VỊ TÍNH</th>
                <th>SỐ LƯỢNG</th>
                <th>LÔ HÀNG</th>
                <th>ĐƠN GIÁ</th>
                <th>THÀNH TIỀN</th>
              </tr>
            </thead>
            <tbody>
              {exportData.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.quantity}</td>
                  <td>{item.batch}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td className="view-export-money">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="view-export-total-box">
          <span>Tổng tiền</span>
          <span className="view-export-total">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewExport;



