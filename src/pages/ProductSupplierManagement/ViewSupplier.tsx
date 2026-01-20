import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './AddSupplier.css'

interface Product {
  id?: string
  code?: string
  name: string
  unit: string
  costPrice: number
  sellingPrice: number
  status: 'active' | 'inactive'
}

interface Supplier {
  id: string
  code?: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  status: 'active' | 'inactive'
  statusLabel?: string
}

const ViewSupplier = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { id } = useParams()

  const supplier = (state as any)?.supplier as Supplier | undefined
  const products = ((state as any)?.products as Product[] | undefined) || []

  if (!supplier) {
    return (
      <div className="add-supplier-page">
        <div className="as-header">
          <button className="as-back-btn" onClick={() => navigate('/admin/product-supplier-management')}>
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
          <h1 className="as-title">Không tìm thấy dữ liệu NCC</h1>
        </div>
        <div className="as-content">
          <p>Không có thông tin nhà cung cấp cho ID: {id}</p>
        </div>
      </div>
    )
  }

  const statusLabel = supplier.statusLabel || (supplier.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động')

  return (
    <div className="add-supplier-page">
      <div className="as-header">
        <button className="as-back-btn" onClick={() => navigate('/admin/product-supplier-management')}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="as-title">Chi tiết Nhà Cung Cấp</h1>
      </div>

      <div className="as-content">
        <div className="as-form" style={{ gap: 24 }}>
          <div className="as-section">
            <h2 className="as-section-title">Thông Tin Nhà Cung Cấp</h2>
            <div className="as-form-grid">
              {supplier.code && (
                <div className="as-form-group">
                  <label>Mã NCC</label>
                  <div className="as-readonly">{supplier.code}</div>
                </div>
              )}
              <div className="as-form-group">
                <label>Tên Công Ty</label>
                <div className="as-readonly">{supplier.name}</div>
              </div>
              <div className="as-form-group">
                <label>Người Liên Hệ</label>
                <div className="as-readonly">{supplier.contactPerson}</div>
              </div>
              <div className="as-form-group">
                <label>Điện Thoại</label>
                <div className="as-readonly">{supplier.phone}</div>
              </div>
              <div className="as-form-group">
                <label>Email</label>
                <div className="as-readonly">{supplier.email}</div>
              </div>
              <div className="as-form-group">
                <label>Địa Chỉ</label>
                <div className="as-readonly">{supplier.address || 'Chưa cập nhật'}</div>
              </div>
              <div className="as-form-group">
                <label>Trạng Thái</label>
                <span className={`as-status ${supplier.status}`}>
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="as-section">
            <h2 className="as-section-title">Sản Phẩm Của Nhà Cung Cấp ({products.length})</h2>
            {products.length === 0 ? (
              <div className="as-readonly">Không có sản phẩm nào</div>
            ) : (
              <div className="as-products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã SP</th>
                      <th>Tên Sản Phẩm</th>
                      <th>Đơn Vị</th>
                      <th>Giá Vốn</th>
                      <th>Giá Bán</th>
                      <th>Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id || index}>
                        <td>{product.code || '—'}</td>
                        <td>{product.name}</td>
                        <td>{product.unit}</td>
                        <td>{product.costPrice.toLocaleString('vi-VN')} ₫</td>
                        <td>{product.sellingPrice.toLocaleString('vi-VN')} ₫</td>
                        <td>
                          <span className={`as-status ${product.status}`}>
                            {product.status === 'active' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewSupplier
