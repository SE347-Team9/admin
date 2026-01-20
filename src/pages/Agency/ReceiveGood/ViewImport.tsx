import React from 'react';
import './ViewImport.css';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, User, Package } from 'lucide-react';

// Mock data for demo
const importData = {
  code: 'PX002',
  agency: 'Đại lý Đại',
  agencyCode: 'DL002',
  createdBy: 'User 3',
  importDate: '11/5/2024',
  createdDate: '11/7/2025',
  status: 'done',
  statusLabel: 'Đã hoàn thành',
  total: 900000,
  products: [
    { name: 'Nước ngọt Pepsi', quantity: 80, price: 9000, total: 720000 },
    { name: 'Sữa Vinamilk', quantity: 3, price: 60000, total: 180000 },
  ],
};

const ViewImport: React.FC = () => {
  const navigate = useNavigate();
  // const { id } = useParams();

  // In real app, fetch importData by id

  return (
    <div className="view-import-page view-import-page--redesign">
      <div className="view-import-header view-import-header--redesign">
        <div className="view-import-header-iconbox">
          <FileText size={52} className="view-import-header-icon" />
        </div>
        <div className="view-import-header-texts">
          <h1 className="view-import-title view-import-title--redesign">CHI TIẾT PHIẾU NHẬP</h1>
          <div className="view-import-subtitle view-import-subtitle--redesign">Xem chi tiết phiếu nhập <b>{importData.code}</b></div>
        </div>
        <button className="view-import-back-btn view-import-back-btn--redesign" onClick={() => navigate(-1)}>
          <ArrowLeft size={22} /> Quay lại
        </button>
      </div>

      <div className="view-import-main view-import-main--redesign">
        {/* Cột trái: Thông tin phiếu nhập + Danh sách sản phẩm */}
        <div className="view-import-main-left view-import-main-left--redesign">
          <div className="view-import-info-card view-import-info-card--redesign">
            <div className="view-import-info-title view-import-info-title--redesign">
              <Package size={22} /> Thông tin phiếu nhập
            </div>
            <div className="view-import-info-fields view-import-info-fields--redesign">
              <div className="view-import-info-field">
                <label>Mã phiếu nhập</label>
                <div className="view-import-info-value">{importData.code}</div>
              </div>
              <div className="view-import-info-field">
                <label>Ngày nhập hàng</label>
                <div className="view-import-info-value">{importData.importDate}</div>
              </div>
              <div className="view-import-info-field">
                <label>Đại lý</label>
                <div className="view-import-info-value">{importData.agency}</div>
              </div>
              <div className="view-import-info-field">
                <label>Mã đại lý</label>
                <div className="view-import-info-value">{importData.agencyCode}</div>
              </div>
              <div className="view-import-info-field">
                <label>Người tạo</label>
                <div className="view-import-info-value">{importData.createdBy}</div>
              </div>
              <div className="view-import-info-field">
                <label>Ngày tạo</label>
                <div className="view-import-info-value">{importData.createdDate}</div>
              </div>
            </div>
          </div>

          <div className="view-import-products-card view-import-products-card--redesign">
            <div className="view-import-products-title view-import-products-title--redesign">
              <Package size={20} /> Danh sách sản phẩm
            </div>
            <table className="view-import-products-table view-import-products-table--redesign">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {importData.products.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toLocaleString('vi-VN')} VND</td>
                    <td className="view-import-product-total view-import-product-total--redesign">{item.total.toLocaleString('vi-VN')} VND</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{textAlign: 'right', fontWeight: 700}}>Tổng cộng:</td>
                  <td className="view-import-product-total view-import-product-total--redesign">{importData.total.toLocaleString('vi-VN')} VND</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Cột phải: Thông tin tổng quan + Thông tin thời gian */}
        <div className="view-import-main-right view-import-main-right--redesign">
          <div className="view-import-summary-card view-import-summary-card--redesign">
            <div className="view-import-summary-title view-import-summary-title--redesign">$ Thông tin tổng quan</div>
            <div className="view-import-summary-row view-import-summary-row--redesign">
              <span>Tình trạng:</span>
              <span className="view-import-status view-import-status--done view-import-status--redesign">Đã hoàn thành</span>
            </div>
            <div className="view-import-summary-row view-import-summary-row--redesign">
              <span>Tổng giá trị:</span>
              <span className="view-import-summary-total view-import-summary-total--redesign">{importData.total.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="view-import-summary-row view-import-summary-row--redesign">
              <span>Số sản phẩm:</span>
              <span>{importData.products.length} mặt hàng</span>
            </div>
          </div>
          <div className="view-import-summary-card view-import-summary-card--redesign">
            <div className="view-import-summary-title view-import-summary-title--redesign"><Calendar size={17} /> Thông tin thời gian</div>
            <div className="view-import-summary-row view-import-summary-row--redesign">
              <span>Ngày nhập hàng:</span>
              <span>{importData.importDate}</span>
            </div>
            <div className="view-import-summary-row view-import-summary-row--redesign">
              <span>Ngày tạo phiếu:</span>
              <span>{importData.createdDate}</span>
            </div>
            <div className="view-import-summary-row view-import-summary-row--redesign">
              <span>Người tạo:</span>
              <span><User size={15} style={{marginRight: 4}} /> {importData.createdBy}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewImport;



