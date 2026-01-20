import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import type { ChangeEvent, FormEvent } from 'react'
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

const EditSupplier = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()

  const supplier = (state as any)?.supplier as Supplier | undefined
  const supplierProducts = ((state as any)?.products as Product[] | undefined) || []

  const [formData, setFormData] = useState(() => ({
    name: supplier?.name || '',
    contactPerson: supplier?.contactPerson || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    address: supplier?.address || '',
    status: supplier?.status || 'active'
  }))

  const [products, setProducts] = useState<Product[]>(() =>
    supplierProducts.map((p) => ({ ...p }))
  )

  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    unit: '',
    costPrice: 0,
    sellingPrice: 0,
    status: 'active'
  })

  const hasSupplier = useMemo(() => Boolean(supplier), [supplier])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )
  }

  const handleAddProduct = () => {
    if (!newProduct.name) {
      toast.error('Vui lòng điền tên sản phẩm')
      return
    }
    setProducts([...products, newProduct])
    setNewProduct({ name: '', unit: '', costPrice: 0, sellingPrice: 0, status: 'active' })
  }

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.contactPerson || !formData.phone || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Người liên hệ, Điện thoại, Email)')
      return
    }
    toast.success('Cập nhật nhà cung cấp thành công!')
    navigate('/admin/product-supplier-management')
  }

  if (!hasSupplier) {
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

  return (
    <div className="add-supplier-page">
      <div className="as-header">
        <button className="as-back-btn" onClick={() => navigate('/product-supplier-management')}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="as-title">Chỉnh sửa Nhà Cung Cấp</h1>
      </div>

      <div className="as-content">
        <form onSubmit={handleSubmit} className="as-form">
          <div className="as-section">
            <h2 className="as-section-title">Thông Tin Nhà Cung Cấp</h2>
            <div className="as-form-grid">
              {supplier?.code && (
                <div className="as-form-group">
                  <label>Mã NCC</label>
                  <div className="as-readonly">{supplier.code}</div>
                </div>
              )}
              <div className="as-form-group">
                <label>Tên Công Ty *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tên công ty"
                  required
                />
              </div>
              <div className="as-form-group">
                <label>Người Liên Hệ *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Người liên hệ"
                  required
                />
              </div>
              <div className="as-form-group">
                <label>Điện Thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Số điện thoại"
                  required
                />
              </div>
              <div className="as-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="as-form-group">
                <label>Địa Chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ"
                />
              </div>
              <div className="as-form-group">
                <label>Trạng Thái</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          <div className="as-section">
            <h2 className="as-section-title">Sản Phẩm Của Nhà Cung Cấp ({products.length})</h2>
            <div className="as-product-form">
              <div className="as-product-form-grid">
                <div className="as-form-group">
                  <label>Tên Sản Phẩm</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Tên sản phẩm"
                  />
                </div>
                <div className="as-form-group">
                  <label>Đơn Vị</label>
                  <input
                    type="text"
                    name="unit"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    placeholder="VD: Thùng"
                  />
                </div>
                <div className="as-form-group">
                  <label>Giá Vốn</label>
                  <input
                    type="number"
                    name="costPrice"
                    value={newProduct.costPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, costPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="VD: 200000"
                  />
                </div>
                <div className="as-form-group">
                  <label>Giá Bán</label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={newProduct.sellingPrice || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: parseFloat(e.target.value) || 0 })}
                    placeholder="VD: 250000"
                  />
                </div>
                <div className="as-form-group">
                  <label>Trạng Thái</label>
                  <select
                    name="status"
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <option value="active">Đang kinh doanh</option>
                    <option value="inactive">Ngừng kinh doanh</option>
                  </select>
                </div>
              </div>
              <button type="button" className="as-add-product-btn" onClick={handleAddProduct}>
                <Plus size={20} />
                <span>Thêm Sản Phẩm</span>
              </button>
            </div>

            {products.length > 0 && (
              <div className="as-products-table" style={{ marginTop: 16 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Tên Sản Phẩm</th>
                      <th>Đơn Vị</th>
                      <th>Giá Vốn</th>
                      <th>Giá Bán</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id || index}>
                        <td>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={product.unit}
                            onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={product.costPrice}
                            onChange={(e) => handleProductChange(index, 'costPrice', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={product.sellingPrice}
                            onChange={(e) => handleProductChange(index, 'sellingPrice', parseFloat(e.target.value) || 0)}
                          />
                        </td>
                        <td>
                          <select
                            value={product.status}
                            onChange={(e) => handleProductChange(index, 'status', e.target.value as 'active' | 'inactive')}
                          >
                            <option value="active">Đang kinh doanh</option>
                            <option value="inactive">Ngừng kinh doanh</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="as-remove-btn"
                            onClick={() => handleRemoveProduct(index)}
                            title="Xóa sản phẩm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="as-form-actions">
            <button type="button" className="as-btn-cancel" onClick={() => navigate('/admin/product-supplier-management')}>
              Hủy
            </button>
            <button type="submit" className="as-btn-submit">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSupplier
