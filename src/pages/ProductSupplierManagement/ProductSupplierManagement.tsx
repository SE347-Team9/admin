import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  Truck,
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  XCircle,
  Search,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'react-toastify'
import './ProductSupplierManagement.css'

interface Product {
  id: string
  code: string
  name: string
  category: string
  unit: string
  costPrice: number
  sellingPrice: number
  supplierId?: string
  status: 'active' | 'inactive'
  statusLabel: string
  createdAt: string
}

interface Supplier {
  id: string
  code: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  taxCode: string
  status: 'active' | 'inactive'
  statusLabel: string
  createdAt: string
}

const ProductSupplierManagement = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'suppliers'>('suppliers')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Product | Supplier | null>(null)
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null)

  // Mock Products Data
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      code: 'SP001',
      name: 'Bia Hà Nội',
      category: 'Đồ uống có cồn',
      unit: 'Thùng',
      costPrice: 200000,
      sellingPrice: 250000,
      supplierId: '1',
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '01/01/2024'
    },
    {
      id: '2',
      code: 'SP002',
      name: 'Nước ngọt Coca',
      category: 'Đồ uống',
      unit: 'Chai',
      costPrice: 8000,
      sellingPrice: 10000,
      supplierId: '2',
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '02/01/2024'
    },
    {
      id: '3',
      code: 'SP003',
      name: 'Snack Oishi',
      category: 'Thực phẩm khô',
      unit: 'Gói',
      costPrice: 10000,
      sellingPrice: 12000,
      supplierId: '1',
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '03/01/2024'
    },
    {
      id: '4',
      code: 'SP004',
      name: 'Gạo ST25',
      category: 'Lương thực',
      unit: 'Kg',
      costPrice: 20000,
      sellingPrice: 25000,
      supplierId: '3',
      status: 'inactive',
      statusLabel: 'Ngừng kinh doanh',
      createdAt: '04/01/2024'
    },
    {
      id: '5',
      code: 'SP005',
      name: 'Sữa Vinamilk',
      category: 'Sữa & sản phẩm từ sữa',
      unit: 'Lốc',
      costPrice: 55000,
      sellingPrice: 60000,
      supplierId: '2',
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '05/01/2024'
    },
    {
      id: '6',
      code: 'SP006',
      name: 'Nước ngọt Pepsi',
      category: 'Đồ uống',
      unit: 'Lon',
      costPrice: 7500,
      sellingPrice: 9000,
      supplierId: '2',
      status: 'active',
      statusLabel: 'Đang kinh doanh',
      createdAt: '06/01/2024'
    }
  ])

  // Mock Suppliers Data
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      code: 'NCC001',
      name: 'Cty TNHH Masan',
      contactPerson: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'contact@masan.com.vn',
      address: 'Hà Nội',
      taxCode: '0123456789',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '01/01/2024'
    },
    {
      id: '2',
      code: 'NCC002',
      name: 'Cty CP Vinamilk',
      contactPerson: 'Trần Thị B',
      phone: '0912345678',
      email: 'sales@vinamilk.com.vn',
      address: 'TP.HCM',
      taxCode: '9876543210',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '02/01/2024'
    },
    {
      id: '3',
      code: 'NCC003',
      name: 'Cty TNHH Unilever Việt Nam',
      contactPerson: 'Lê Văn C',
      phone: '0923456789',
      email: 'suppliers@unilever.com.vn',
      address: 'Đà Nẵng',
      taxCode: '5432109876',
      status: 'inactive',
      statusLabel: 'Ngừng hoạt động',
      createdAt: '03/01/2024'
    },
    {
      id: '4',
      code: 'NCC004',
      name: 'Cty TNHH Nestlé Việt Nam',
      contactPerson: 'Phạm Thị D',
      phone: '0934567890',
      email: 'procurement@nestle.com.vn',
      address: 'Bình Dương',
      taxCode: '1098765432',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '04/01/2024'
    },
    {
      id: '5',
      code: 'NCC005',
      name: 'Cty TNHH Coca-Cola Việt Nam',
      contactPerson: 'Trần Văn E',
      phone: '0945678901',
      email: 'supplier@cocacola.com.vn',
      address: 'Long An',
      taxCode: '0987654321',
      status: 'active',
      statusLabel: 'Hoạt động',
      createdAt: '05/01/2024'
    }
  ])

  // Calculate statistics
  const productStats = useMemo(() => {
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      inactive: products.filter(p => p.status === 'inactive').length
    }
  }, [products])

  const supplierStats = useMemo(() => {
    return {
      total: suppliers.length,
      active: suppliers.filter(s => s.status === 'active').length,
      inactive: suppliers.filter(s => s.status === 'inactive').length
    }
  }, [suppliers])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [products, searchTerm, statusFilter])

  // Filter suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [suppliers, searchTerm, statusFilter])

  // Get supplier name by ID
  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return 'N/A'
    return suppliers.find(s => s.id === supplierId)?.name || 'N/A'
  }

  // Get products by supplier ID
  const getSupplierProducts = (supplierId: string) => {
    return products.filter(p => p.supplierId === supplierId)
  }

  // Delete handlers
  const handleDeleteProduct = (product: Product) => {
    setDeleteItem(product)
    setShowDeleteModal(true)
  }

  const handleDeleteSupplier = (supplier: Supplier) => {
    setDeleteItem(supplier)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (!deleteItem) return
    
    if ('category' in deleteItem) {
      // It's a product
      setProducts(products.filter(p => p.id !== deleteItem.id))
      toast.success('Xóa sản phẩm thành công!')
    } else {
      // It's a supplier
      setSuppliers(suppliers.filter(s => s.id !== deleteItem.id))
      toast.success('Xóa nhà cung cấp thành công!')
    }
    
    setShowDeleteModal(false)
    setDeleteItem(null)
  }

  return (
    <div className="product-supplier-page">
      {/* Header */}
      <div className="ps-header">
        <div className="ps-header-content">
          <h1 className="ps-title">Quản lý nhà cung cấp và sản phẩm</h1>
          <p className="ps-subtitle">Quản lý thông tin nhà cung cấp và danh sách sản phẩm của họ</p>
        </div>
        <button 
          className="ps-btn-add"
          onClick={() => navigate('/add-supplier-product')}
        >
          <Plus size={20} />
          <span>Thêm NCC</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="ps-stats-grid">
        <>
          <div className="ps-stat-card">
            <div className="ps-stat-content">
              <h3 className="ps-stat-label">Tổng NCC</h3>
              <p className="ps-stat-value">{supplierStats.total}</p>
            </div>
            <div className="ps-stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
              <Truck size={24} />
            </div>
          </div>
          <div className="ps-stat-card">
            <div className="ps-stat-content">
              <h3 className="ps-stat-label">Đang hoạt động</h3>
              <p className="ps-stat-value">{supplierStats.active}</p>
            </div>
            <div className="ps-stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="ps-stat-card">
            <div className="ps-stat-content">
              <h3 className="ps-stat-label">Ngừng hoạt động</h3>
              <p className="ps-stat-value">{supplierStats.inactive}</p>
            </div>
            <div className="ps-stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <XCircle size={24} />
            </div>
          </div>
        </>
      </div>

      {/* Tabs */}
      <div className="ps-tabs" style={{ display: 'none' }}>
      </div>

      {/* Search & Filter */}
      <div className="ps-controls">
        <div className="ps-search">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm nhà cung cấp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="ps-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>

      {/* Products Table */}
      {false && (
        <div className="ps-table-wrapper"></div>
      )}

      {/* Suppliers Table */}
      <div className="ps-table-wrapper">
          <table className="ps-table">
            <thead>
              <tr>
                <th></th>
                <th>MÃ NCC</th>
                <th>TÊN CÔNG TY</th>
                <th>NGƯỜI LIÊN HỆ</th>
                <th>ĐIỆN THOẠI</th>
                <th>EMAIL</th>
                <th>ĐỊA CHỈ</th>
                <th>TRẠNG THÁI</th>
                <th>SỐ SẢN PHẨM</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <>
                  <tr>
                    <td className="ps-expand-cell">
                      <button 
                        className={`ps-expand-btn ${expandedSupplier === supplier.id ? 'expanded' : ''}`}
                        onClick={() => setExpandedSupplier(expandedSupplier === supplier.id ? null : supplier.id)}
                        title={expandedSupplier === supplier.id ? "Ẩn sản phẩm" : "Xem sản phẩm"}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </td>
                    <td><span className="ps-code">{supplier.code}</span></td>
                    <td><strong>{supplier.name}</strong></td>
                    <td>{supplier.contactPerson}</td>
                    <td>{supplier.phone}</td>
                    <td>{supplier.email}</td>
                    <td>{supplier.address}</td>
                    <td>
                      <span className={`ps-status ps-status-${supplier.status}`}>
                        {supplier.statusLabel}
                      </span>
                    </td>
                    <td className="ps-product-count">{getSupplierProducts(supplier.id).length}</td>
                    <td className="ps-actions">
                      <button
                        className="ps-action-btn ps-view"
                        title="Xem"
                        onClick={() => navigate(`/product-supplier/${supplier.id}/view`, {
                          state: { supplier, products: getSupplierProducts(supplier.id) }
                        })}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="ps-action-btn ps-edit"
                        title="Sửa"
                        onClick={() => navigate(`/product-supplier/${supplier.id}/edit`, {
                          state: { supplier, products: getSupplierProducts(supplier.id) }
                        })}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="ps-action-btn ps-delete" 
                        title="Xóa"
                        onClick={() => handleDeleteSupplier(supplier)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Products Row */}
                  {expandedSupplier === supplier.id && (
                    <tr className="ps-expand-row">
                      <td colSpan={10}>
                        <div className="ps-products-list">
                          <h4 className="ps-products-title">Sản phẩm của {supplier.name}</h4>
                          {getSupplierProducts(supplier.id).length > 0 ? (
                            <div className="ps-products-grid">
                              {getSupplierProducts(supplier.id).map((product) => (
                                <div key={product.id} className="ps-product-item">
                                  <div className="ps-product-header">
                                    <span className="ps-product-code">{product.code}</span>
                                    <span className={`ps-product-status ps-product-status-${product.status}`}>
                                      {product.statusLabel}
                                    </span>
                                  </div>
                                  <h5 className="ps-product-name">{product.name}</h5>
                                  <div className="ps-product-details">
                                    <div className="ps-product-detail">
                                      <span className="ps-detail-label">Đơn vị:</span>
                                      <span className="ps-detail-value">{product.unit}</span>
                                    </div>
                                    <div className="ps-product-detail">
                                      <span className="ps-detail-label">Giá vốn:</span>
                                      <span className="ps-detail-value">{product.costPrice.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="ps-product-detail">
                                      <span className="ps-detail-label">Giá bán:</span>
                                      <span className="ps-detail-value ps-detail-selling">{product.sellingPrice.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="ps-no-products">
                              <p>Nhà cung cấp này không có sản phẩm nào</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="ps-modal-overlay">
          <div className="ps-modal-content">
            <h2 className="ps-modal-title">Xác nhận xóa</h2>
            <p className="ps-modal-message">
              {deleteItem && ('category' in deleteItem) 
                ? `Bạn có chắc chắn muốn xóa sản phẩm "${deleteItem.name}" không?`
                : `Bạn có chắc chắn muốn xóa nhà cung cấp "${(deleteItem as Supplier)?.name}" không?`
              }
            </p>
            <div className="ps-modal-actions">
              <button 
                className="ps-modal-btn ps-modal-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button 
                className="ps-modal-btn ps-modal-confirm"
                onClick={confirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductSupplierManagement
