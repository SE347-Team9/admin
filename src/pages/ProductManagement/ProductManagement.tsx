import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle,
  Search,
  Boxes
} from 'lucide-react'
import { toast } from 'react-toastify'
import './ProductManagement.css'

interface Product {
  id: string
  code: string
  name: string
  category: string
  unit: string
  costPrice: number
  sellingPrice: number
  status: 'active' | 'inactive'
  statusLabel: string
  createdAt: string
}

const ProductManagement = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)

  // Mock data - danh mục sản phẩm (master data)
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      code: 'SP001',
      name: 'Bia Hà Nội',
      category: 'Đồ uống có cồn',
      unit: 'Thùng',
      costPrice: 200000,
      sellingPrice: 250000,
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '01/01/2024'
    },
    {
      id: '2',
      code: 'SP002',
      name: 'Nước ngọt Pepsi',
      category: 'Nước giải khát',
      unit: 'Thùng',
      costPrice: 150000,
      sellingPrice: 180000,
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '15/01/2024'
    },
    {
      id: '3',
      code: 'SP003',
      name: 'Sữa Vinamilk',
      category: 'Sữa & Sản phẩm từ sữa',
      unit: 'Lốc',
      costPrice: 45000,
      sellingPrice: 60000,
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '20/01/2024'
    },
    {
      id: '4',
      code: 'SP004',
      name: 'Bánh quy Oreo',
      category: 'Bánh kẹo',
      unit: 'Hộp',
      costPrice: 25000,
      sellingPrice: 35000,
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '25/01/2024'
    },
    {
      id: '5',
      code: 'SP005',
      name: 'Gạo ST25',
      category: 'Lương thực',
      unit: 'Kg',
      costPrice: 22000,
      sellingPrice: 28000,
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '01/02/2024'
    },
    {
      id: '6',
      code: 'SP006',
      name: 'Snack Oishi',
      category: 'Bánh kẹo',
      unit: 'Gói',
      costPrice: 8000,
      sellingPrice: 12000,
      status: 'inactive',
      statusLabel: 'Ngừng kinh doanh',
      createdAt: '10/02/2024'
    }
  ])

  // Statistics
  const totalProducts = products.length
  const activeProducts = products.filter(p => p.status === 'active').length
  const inactiveProducts = products.filter(p => p.status === 'inactive').length

  // Filter products
  const filteredProducts = products.filter(product =>
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ'
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'inactive':
        return 'status-inactive'
      default:
        return ''
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 size={14} />
      case 'inactive':
        return <XCircle size={14} />
      default:
        return <CheckCircle2 size={14} />
    }
  }

  const handleViewProduct = (productId: string) => {
    navigate(`/view-product/${productId}`)
  }

  const handleEditProduct = (productId: string) => {
    navigate(`/edit-product/${productId}`)
  }

  const handleDeleteProduct = (product: Product) => {
    setDeleteProduct(product)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (deleteProduct) {
      setProducts(prev => prev.filter(p => p.id !== deleteProduct.id))
      toast.success(`Đã xóa sản phẩm ${deleteProduct.name}`)
    }
    setShowDeleteModal(false)
    setDeleteProduct(null)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteProduct(null)
  }

  return (
    <div className="product-management-page">
      <div className="product-container">
        {/* Page Header */}
        <div className="product-header">
          <div className="header-icon-box">
            <Package size={36} />
          </div>
          <div className="header-text">
            <h1 className="product-title">Quản lý danh mục sản phẩm</h1>
            <p className="product-subtitle">
              Quản lý danh mục sản phẩm (master data) trong hệ thống phân phối.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <div className="stats-cards-grid">
            <div className="stats-card gradient-blue">
              <div className="stats-card-content">
                <div className="stats-label">Tổng sản phẩm</div>
                <div className="stats-value">{totalProducts}</div>
              </div>
              <div className="stats-icon">
                <Boxes size={44} strokeWidth={2.5} />
              </div>
            </div>

            <div className="stats-card gradient-green">
              <div className="stats-card-content">
                <div className="stats-label">Đang kinh doanh</div>
                <div className="stats-value">{activeProducts}</div>
              </div>
              <div className="stats-icon">
                <CheckCircle2 size={44} strokeWidth={2.5} />
              </div>
            </div>

            <div className="stats-card gradient-red">
              <div className="stats-card-content">
                <div className="stats-label">Ngừng kinh doanh</div>
                <div className="stats-value">{inactiveProducts}</div>
              </div>
              <div className="stats-icon">
                <XCircle size={44} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Products List Section */}
        <div className="products-section">
          <div className="section-header">
            <div className="header-left">
              <Package size={24} />
              <h2>Danh sách sản phẩm ({filteredProducts.length})</h2>
            </div>
            <div className="header-right">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                className="btn-create-product"
                onClick={() => navigate('/add-product')}
              >
                <Plus size={20} />
                Thêm sản phẩm
              </button>
            </div>
          </div>

          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>MÃ SP</th>
                  <th>TÊN SẢN PHẨM</th>
                  <th>DANH MỤC</th>
                  <th>ĐƠN VỊ</th>
                  <th>GIÁ NHẬP</th>
                  <th>GIÁ BÁN</th>
                  <th>TRẠNG THÁI</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <span className="product-code">{product.code}</span>
                      </td>
                      <td className="product-name">{product.name}</td>
                      <td className="product-category">{product.category}</td>
                      <td className="product-unit">{product.unit}</td>
                      <td className="price-cell cost-price">
                        {formatCurrency(product.costPrice)}
                      </td>
                      <td className="price-cell selling-price">
                        {formatCurrency(product.sellingPrice)}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(product.status)}`}>
                          {getStatusIcon(product.status)}
                          {product.statusLabel}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-view"
                            onClick={() => handleViewProduct(product.id)}
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEditProduct(product.id)}
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDeleteProduct(product)}
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="no-data">
                      <Package size={48} />
                      <p>Không tìm thấy sản phẩm nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteProduct && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content modal-delete" onClick={e => e.stopPropagation()}>
            <div className="modal-delete-iconbox">
              <Trash2 size={32} />
            </div>
            <div className="modal-delete-title">Xác nhận xóa sản phẩm</div>
            <div className="modal-delete-desc">
              Bạn có chắc chắn muốn xóa sản phẩm <b>{deleteProduct.name}</b> ({deleteProduct.code})?
            </div>
            <div className="modal-delete-warning">
              Lưu ý: Nếu sản phẩm đang được sử dụng trong các phiếu nhập/xuất, việc xóa có thể ảnh hưởng đến dữ liệu.
            </div>
            <div className="modal-delete-actions">
              <button className="btn-modal-cancel" onClick={handleCancelDelete}>Hủy</button>
              <button className="btn-modal-delete" onClick={handleConfirmDelete}>Xóa sản phẩm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement
