

import { useNavigate } from 'react-router-dom';
import { FileEdit, Building2, User, Phone, MapPin, Mail, Calendar, Coins, CheckCircle2, ArrowLeft } from 'lucide-react';
import './EditPayment.css';

const agency = {
  name: 'Đại lý Đại',
  phone: '02232434242',
  address: 'Số 2, Phố Đống Đa, Đống Đa, Hà Nội',
  email: 'daiagency@gmail.com',
  representative: 'Đại lý Đại',
};

const payment = {
  id: 5,
  date: '2025-10-10',
  amount: 100000,
  note: '',
  debtStart: 12400000,
  collected: 100000,
  debtEnd: 12300000,
};

export default function EditPayment() {
  const navigate = useNavigate();
  return (
    <div className="ep-root">
      <div className="ep-header-row">
  <div className="ep-header-icon"><FileEdit size={36} /></div>
        <div className="ep-header-title-group">
          <div className="ep-header-title">Chỉnh Sửa Phiếu Thu</div>
          <div className="ep-header-desc">Cập nhật chi tiết cho phiếu thu #{payment.id}</div>
        </div>
        <button className="ep-back-btn" onClick={() => navigate('/staff/payment-management')}>
          <ArrowLeft size={20} style={{marginRight: 6}} /> Quay lại danh sách
        </button>
      </div>
      <div className="ep-main">
        <div className="ep-left">
          <div className="ep-card">
            <div className="ep-section-title">
              <span className="ep-section-icon"><Building2 size={20} /></span>
              Thông tin Đại Lý
            </div>
            <div className="ep-agency-box">
              <div className="ep-agency-row">
                <div className="ep-agency-info">
                  <div className="ep-agency-label"><User size={16} /> Người đại diện</div>
                  <div className="ep-agency-value">{agency.representative}</div>
                </div>
                <div className="ep-agency-info">
                  <div className="ep-agency-label"><Phone size={16} /> Số điện thoại</div>
                  <div className="ep-agency-value">{agency.phone}</div>
                </div>
              </div>
              <div className="ep-agency-row">
                <div className="ep-agency-info">
                  <div className="ep-agency-label"><MapPin size={16} /> Địa chỉ</div>
                  <div className="ep-agency-value">{agency.address}</div>
                </div>
              </div>
              <div className="ep-agency-row">
                <div className="ep-agency-info">
                  <div className="ep-agency-label"><Mail size={16} /> Email</div>
                  <div className="ep-agency-value">{agency.email}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="ep-card">
            <div className="ep-section-title">
              <span className="ep-section-icon"><Coins size={20} /></span>
              Thông tin Thu Tiền
            </div>
            <form className="ep-form">
              <div className="ep-form-row">
                <div className="ep-form-group">
                  <label>Ngày thu tiền <span className="ep-required">*</span></label>
                  <div className="ep-input-icon-group">
                    <input type="date" value={payment.date} readOnly />
                    <Calendar size={16} />
                  </div>
                </div>
                <div className="ep-form-group">
                  <label>Số tiền thu (VND) <span className="ep-required">*</span></label>
                  <div className="ep-input-money">
                    <span className="ep-money-icon">₫</span>
                    <input type="number" value={payment.amount} readOnly />
                  </div>
                </div>
              </div>
              <div className="ep-form-group">
                <label>Ghi chú</label>
                <textarea placeholder="Thêm ghi chú cho phiếu thu..." value={payment.note} readOnly />
              </div>
            </form>
          </div>
        </div>
        <div className="ep-right">
          <div className="ep-summary-card">
            <div className="ep-summary-title">Tóm Tắt Phiếu Thu</div>
            <div className="ep-summary-main">
              <div className="ep-summary-label">Tổng tiền thu</div>
              <div className="ep-summary-value">{payment.amount.toLocaleString('vi-VN')} <span className="ep-summary-vnd">VND</span></div>
            </div>
            <div className="ep-summary-list">
              <div className="ep-summary-row"><span>Nợ ban đầu:</span><span>{payment.debtStart.toLocaleString('vi-VN')} VND</span></div>
              <div className="ep-summary-row"><span>Thu kỳ này:</span><span>- {payment.collected.toLocaleString('vi-VN')} VND</span></div>
              <div className="ep-summary-row"><span>Nợ còn lại:</span><span className="ep-summary-highlight">{payment.debtEnd.toLocaleString('vi-VN')} VND</span></div>
            </div>
          </div>
          <div className="ep-actions">
            <button className="ep-update-btn"><CheckCircle2 size={20} style={{marginRight: 6}} /> Cập Nhật Phiếu Thu</button>
            <button className="ep-cancel-btn" onClick={() => navigate('/staff/payment-management')}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}



