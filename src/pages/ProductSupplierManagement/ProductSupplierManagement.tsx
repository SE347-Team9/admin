import { useState, useMemo, useEffect } from 'react'
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
import { productService } from '../../api/endpoints/productService'
import { supplierService } from '../../api/endpoints/supplierService'
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
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, suppliersRes] = await Promise.all([
        productService.getAll(),
        supplierService.getAll()
      ])

      if (productsRes.success) {
        const transformedProducts = productsRes.data.map((p: any) => ({
          id: p.id,
          code: p.code,
          name: p.name,
          category: p.category || 'Khác',
          unit: p.unit,
          costPrice: parseFloat(p.costPrice) || 0,
          sellingPrice: parseFloat(p.sellingPrice) || 0,
          supplierId: p.supplierId,
          status: p.status as 'active' | 'inactive',
          statusLabel: p.status === 'active' ? 'Đang kinh doanh' : 'Ngừng kinh doanh',
          createdAt: new Date(p.createdAt).toLocaleDateString('vi-VN')
        }))
        setProducts(transformedProducts)
      }

      if (suppliersRes.success) {
        const transformedSuppliers = suppliersRes.data.map((s: any) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          contactPerson: s.contactPerson || '',
          phone: s.phone || '',
          email: s.email || '',
          address: s.address || '',
          taxCode: s.taxCode || '',
          status: s.status as 'active' | 'inactive',
          statusLabel: s.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động',
          createdAt: new Date(s.createdAt).toLocaleDateString('vi-VN')
        }))
        setSuppliers(transformedSuppliers)
      }
    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

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

  const confirmDelete = async () => {
    if (!deleteItem) return
    
    try {
      if ('category' in deleteItem) {
        // It's a product
        const response = await productService.delete(deleteItem.id)
        if (response.success) {
          toast.success('Xóa sản phẩm thành công!')
          fetchData()
        }
      } else {
        // It's a supplier
        const response = await supplierService.delete(deleteItem.id)
        if (response.success) {
          toast.success('Xóa nhà cung cấp thành công!')
          fetchData()
        }
      }
    } catch (error: any) {
      console.error('Error deleting:', error)
      const errorMsg = error.response?.data?.message || 'Không thể xóa'
      toast.error(errorMsg)
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
          onClick={() => navigate('/admin/add-supplier')}
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
