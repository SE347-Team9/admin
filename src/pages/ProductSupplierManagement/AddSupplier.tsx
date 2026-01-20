import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import './AddSupplier.css'

interface Product {
  name: string
  unit: string
  costPrice: number
  sellingPrice: number
  status: 'active' | 'inactive'
}

const AddSupplier = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    status: 'active' as 'active' | 'inactive'
  })

  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    unit: '',
    costPrice: 0,
    sellingPrice: 0,
    status: 'active'
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleProductInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct({
      ...newProduct,
      [name]: name === 'costPrice' || name === 'sellingPrice' ? parseFloat(value) || 0 : value
    })
  }

  const addProduct = () => {
    if (!newProduct.name) {
      toast.error('Vui lòng điền tên sản phẩm')
      return
    }

    setProducts([...products, newProduct])
    setNewProduct({
      name: '',
      unit: '',
      costPrice: 0,
      sellingPrice: 0,
      status: 'active'
    })
    toast.success('Thêm sản phẩm thành công!')
  }

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.contactPerson || !formData.phone || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Người liên hệ, Điện thoại, Email)')
      return
    }

    // Lưu dữ liệu (giả lập)
    console.log('Nhà cung cấp mới:', formData)
    console.log('Sản phẩm:', products)

    toast.success('Thêm nhà cung cấp thành công!')
    navigate('/admin/product-supplier-management')
  }

  return (
    <div className="add-supplier-page">
      <div className="as-header">
        <button className="as-back-btn" onClick={() => navigate('/admin/product-supplier-management')}>
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>
        <h1 className="as-title">Thêm Nhà Cung Cấp Mới</h1>
      </div>

      <div className="as-content">
        <form onSubmit={handleSubmit} className="as-form">
          {/* Supplier Information Section */}
          <div className="as-section">
            <h2 className="as-section-title">Thông Tin Nhà Cung Cấp</h2>

            <div className="as-form-grid">
              <div className="as-form-group">
                <label htmlFor="name">Tên Công Ty *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: Công Ty TNHH ABC"
                  required
                />
              </div>

              <div className="as-form-group">
                <label htmlFor="contactPerson">Người Liên Hệ *</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="VD: Nguyễn Văn A"
                  required
                />
              </div>

              <div className="as-form-group">
                <label htmlFor="phone">Điện Thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="VD: 0901234567"
                  required
                />
              </div>

              <div className="as-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="VD: contact@company.com"
                  required
                />
              </div>

              <div className="as-form-group">
                <label htmlFor="address">Địa Chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="VD: Hà Nội"
                />
              </div>

              <div className="as-form-group">
                <label htmlFor="status">Trạng Thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="as-section">
            <h2 className="as-section-title">Sản Phẩm Của Nhà Cung Cấp</h2>

            {/* Add Product Form */}
            <div className="as-product-form">
              <div className="as-product-form-grid">
                <div className="as-form-group">
                  <label htmlFor="product-name">Tên Sản Phẩm</label>
                  <input
                    type="text"
                    id="product-name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleProductInputChange}
                    placeholder="VD: Bia Hà Nội"
                  />
                </div>

                <div className="as-form-group">
                  <label htmlFor="product-unit">Đơn Vị</label>
                  <input
                    type="text"
                    id="product-unit"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleProductInputChange}
                    placeholder="VD: Thùng"
                  />
                </div>

                <div className="as-form-group">
                  <label htmlFor="product-cost">Giá Vốn</label>
                  <input
                    type="number"
                    id="product-cost"
                    name="costPrice"
                    value={newProduct.costPrice || ''}
                    onChange={handleProductInputChange}
                    placeholder="VD: 200000"
                  />
                </div>

                <div className="as-form-group">
                  <label htmlFor="product-selling">Giá Bán</label>
                  <input
                    type="number"
                    id="product-selling"
                    name="sellingPrice"
                    value={newProduct.sellingPrice || ''}
                    onChange={handleProductInputChange}
                    placeholder="VD: 250000"
                  />
                </div>

                <div className="as-form-group">
                  <label htmlFor="product-status">Trạng Thái</label>
                  <select
                    id="product-status"
                    name="status"
                    value={newProduct.status}
                    onChange={handleProductInputChange}
                  >
                    <option value="active">Đang kinh doanh</option>
                    <option value="inactive">Ngừng kinh doanh</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="as-add-product-btn"
                onClick={addProduct}
              >
                <Plus size={20} />
                <span>Thêm Sản Phẩm</span>
              </button>
            </div>

            {/* Products List */}
            {products.length > 0 && (
              <div className="as-products-list">
                <h3 className="as-products-title">Danh Sách Sản Phẩm ({products.length})</h3>
                <div className="as-products-table">
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
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.unit}</td>
                          <td>{product.costPrice.toLocaleString('vi-VN')} ₫</td>
                          <td>{product.sellingPrice.toLocaleString('vi-VN')} ₫</td>
                          <td>
                            <span className={`as-status ${product.status}`}>
                              {product.status === 'active' ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="as-remove-btn"
                              onClick={() => removeProduct(index)}
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
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="as-form-actions">
            <button
              type="button"
              className="as-btn-cancel"
              onClick={() => navigate('/admin/product-supplier-management')}
            >
              Hủy
            </button>
            <button type="submit" className="as-btn-submit">
              Thêm Nhà Cung Cấp
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSupplier
