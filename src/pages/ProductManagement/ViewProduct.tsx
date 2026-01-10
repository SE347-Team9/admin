import { Package, ArrowLeft, Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import './ViewProduct.css'

const ViewProduct = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  // Mock data - should fetch from API based on id
  const product = {
    id: id || '1',
    code: 'SP001',
    name: 'Bia Hà Nội',
    category: 'Đồ uống có cồn',
    unit: 'Thùng',
    costPrice: 200000,
    sellingPrice: 250000,
    description: 'Bia Hà Nội là thương hiệu bia nổi tiếng của Việt Nam, được sản xuất bởi Tổng công ty Bia - Rượu - Nước giải khát Hà Nội (HABECO).',
    status: 'active',
    statusLabel: 'Đang kinh doanh',
    createdAt: '01/01/2024',
    updatedAt: '10/01/2026'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const handleBack = () => {
    navigate('/product-management')
  }

  const handleEdit = () => {
    navigate(`/edit-product/${product.id}`)
  }

  return (
    <div className="view-product-page">
      <div className="view-product-container">
        {/* Header */}
        <div className="view-product__header">
          <div className="view-product__header-icon">
            <Package size={36} />
          </div>
          <div className="view-product__header-content">
            <h1 className="view-product__title">Chi tiết sản phẩm</h1>
            <p className="view-product__subtitle">
              Xem thông tin chi tiết sản phẩm trong danh mục
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="view-product__content">
          <div className="view-product__card">
            <h2 className="view-product__card-title">Thông tin sản phẩm</h2>
            <div className="view-product__info-grid">
              <div className="view-product__info-item">
                <span className="view-product__info-label">Mã sản phẩm:</span>
                <span className="view-product__info-value view-product__code">{product.code}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Tên sản phẩm:</span>
                <span className="view-product__info-value">{product.name}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Danh mục:</span>
                <span className="view-product__info-value">{product.category}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Đơn vị tính:</span>
                <span className="view-product__info-value">{product.unit}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Giá nhập:</span>
                <span className="view-product__info-value view-product__price">{formatCurrency(product.costPrice)}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Giá bán:</span>
                <span className="view-product__info-value view-product__price view-product__price--selling">{formatCurrency(product.sellingPrice)}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Ngày tạo:</span>
                <span className="view-product__info-value">{product.createdAt}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Cập nhật lần cuối:</span>
                <span className="view-product__info-value">{product.updatedAt}</span>
              </div>

              <div className="view-product__info-item">
                <span className="view-product__info-label">Trạng thái:</span>
                <span className={`view-product__status ${product.status}`}>
                  {product.statusLabel}
                </span>
              </div>

              {product.description && (
                <div className="view-product__info-item view-product__info-item--full">
                  <span className="view-product__info-label">Mô tả:</span>
                  <span className="view-product__info-value">{product.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="view-product__footer">
          <button className="view-product__btn view-product__btn--secondary" onClick={handleBack}>
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>
          <button className="view-product__btn view-product__btn--primary" onClick={handleEdit}>
            <Edit size={20} />
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewProduct
