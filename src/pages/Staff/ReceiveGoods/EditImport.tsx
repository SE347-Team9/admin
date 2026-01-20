import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Calendar, User, ArrowLeft, Trash2, Plus, Save } from 'lucide-react';
import './EditImport.css';

const initialData = {
  id: 4,
  code: '#4',
  date: '2024-05-04',
  supplier: '',
  items: [
    { name: 'Gạo ST25', quantity: 60, price: 25000 },
    { name: 'Nước ngọt Pepsi', quantity: 100, price: 9000 },
    { name: 'Snack Oishi', quantity: 50, price: 12000 },
  ],
};

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' VND';

const EditImport = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(initialData.date);
  const [supplier, setSupplier] = useState(initialData.supplier);
  const [items, setItems] = useState(initialData.items);

  const handleItemChange = (idx: number, field: string, value: string | number) => {
    setItems(items => items.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleAddItem = () => {
    setItems(items => [...items, { name: '', quantity: 1, price: 0 }]);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="edit-import-wrapper">
      <div className="edit-import-header">
        <div className="edit-import-header-icon"><Box size={36} /></div>
        <div className="edit-import-header-content">
          <h1 className="edit-import-title">Chỉnh sửa Phiếu Nhập</h1>
          <p className="edit-import-desc">Cập nhật thông tin phiếu nhập <b>{initialData.code}</b></p>
        </div>
        <div className="edit-import-header-actions">
          <button className="edit-import-save-btn">
            <Save size={18} /> Lưu thay đổi
          </button>
          <button className="edit-import-back-btn" onClick={() => navigate('/staff/receive-goods')}>
            <ArrowLeft size={20} /> Quay lại
          </button>
        </div>
      </div>
      <div className="edit-import-main">
        <div className="edit-import-section">
          <h2 className="edit-import-section-title">Thông tin phiếu nhập</h2>
          <div className="edit-import-info-grid">
            <div className="edit-import-info-field">
              <label className="edit-import-label">Ngày nhập hàng</label>
              <div className="edit-import-input-icon-group">
                <Calendar size={18} className="edit-import-input-icon" />
                <input
                  className="edit-import-input"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="edit-import-info-field">
              <label className="edit-import-label">Nhà cung cấp</label>
              <div className="edit-import-input-icon-group">
                <User size={18} className="edit-import-input-icon" />
                <input
                  className="edit-import-input"
                  type="text"
                  placeholder="Nhà cung cấp"
                  value={supplier}
                  onChange={e => setSupplier(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="edit-import-section">
          <div className="edit-import-section-title-row">
            <h2 className="edit-import-section-title">Danh sách sản phẩm</h2>
            <button className="edit-import-add-btn" onClick={handleAddItem}><Plus size={18} /> Thêm sản phẩm</button>
          </div>
          <div className="edit-import-products-list">
            {items.map((item, idx) => (
              <div className="edit-import-product-row" key={idx}>
                <input
                  className="edit-import-product-input"
                  value={item.name}
                  onChange={e => handleItemChange(idx, 'name', e.target.value)}
                  placeholder="Tên sản phẩm"
                />
                <input
                  className="edit-import-product-input"
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                  placeholder="Số lượng"
                />
                <input
                  className="edit-import-product-input"
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={e => handleItemChange(idx, 'price', Number(e.target.value))}
                  placeholder="Đơn giá"
                />
                <span className="edit-import-product-money">{formatCurrency(item.price * item.quantity)}</span>
                <button
                  className="edit-import-product-remove"
                  onClick={() => handleRemoveItem(idx)}
                  title="Xóa sản phẩm"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="edit-import-total-row">
          <span className="edit-import-total-label">Tổng cộng:</span>
          <span className="edit-import-total-value">{total.toLocaleString('vi-VN')} VND</span>
        </div>
      </div>
    </div>
  );
};

export default EditImport;



