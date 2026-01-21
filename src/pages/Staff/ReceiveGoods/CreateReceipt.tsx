import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { productService } from '../../../api/endpoints/productService'
import { supplierService } from '../../../api/endpoints/supplierService'
import importService from '../../../api/endpoints/importService'
import './CreateReceipt.css'

interface ReceiptItem {
  id: number
  product: string
  unit: string
  quantity: number
  price: number
  total: number
}

const CreateReceipt = () => {
  const navigate = useNavigate()
  const [supplierId, setSupplierId] = useState('')
  const [supplierName, setSupplierName] = useState('')
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: 1, product: '', unit: '', quantity: 0, price: 0, total: 0 }
  ])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [supplierProducts, setSupplierProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [supplierRes, productRes] = await Promise.all([
        supplierService.getAll(),
        productService.getAll()
      ])
      
      console.log('Suppliers:', supplierRes.data)
      console.log('Products:', productRes.data)
      
      if (supplierRes.success) setSuppliers(supplierRes.data)
      if (productRes.success) setAllProducts(productRes.data)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="create-receipt-page"><p>Đang tải...</p></div>
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: newId, product: '', unit: '', quantity: 0, price: 0, total: 0 }])
  }

  const handlePriceChange = (id: number, price: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, price, total: price * item.quantity }
        return updatedItem
      }
      return item
    }))
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const handleProductChange = (id: number, productName: string) => {
     const selectedProduct = supplierProducts.find(p => p.name === productName)
    if (selectedProduct) {
      setItems(items.map(item => {
        if (item.id === id) {
          const costPrice = selectedProduct.cost_price || selectedProduct.costPrice || 0
          const updatedItem = {
            ...item,
            product: productName,
            unit: selectedProduct.unit || '',
            price: costPrice,
            total: item.quantity * costPrice
          }
          return updatedItem
        }
        return item
      }))
    }
  }

  const handleSupplierChange = async (selectedSupplierId: string) => {
    setSupplierId(selectedSupplierId)
    const supplier = suppliers.find(s => s.id.toString() === selectedSupplierId)
    setSupplierName(supplier?.name || '')
    
    // Reset items when changing supplier
    setItems([{ id: 1, product: '', unit: '', quantity: 0, price: 0, total: 0 }])
    
    if (selectedSupplierId) {
      try {
        // Log first product to see structure
        if (allProducts.length > 0) {
          console.log('Sample product structure:', allProducts[0])
        }
        
        // Filter products by supplier_id (check multiple field names and formats)
        const filtered = allProducts.filter(p => {
          // Try different field name variations
          const suppId = p.supplier_id || p.supplierId || p.supplier?.id || p.supplier || 
                        p.supplierID || p.Supplier_id || p.SupplierId
          
          if (!suppId) {
            console.log('Product without supplier_id:', p.name || p.code)
            return false
          }
          
          const supplierIdStr = suppId.toString()
          const match = supplierIdStr === selectedSupplierId
          
          if (match) {
            console.log('Matched product:', p.name, 'supplier_id:', suppId)
          }
          
          return match
        })
        
        console.log('Selected supplier ID:', selectedSupplierId)
        console.log('Total products:', allProducts.length)
        console.log('Filtered products:', filtered.length)
        
        setSupplierProducts(filtered)
        
        if (filtered.length === 0) {
          toast.warning('Nhà cung cấp này chưa có sản phẩm nào. Vui lòng kiểm tra lại dữ liệu.')
        } else {
          toast.success(`Tìm thấy ${filtered.length} sản phẩm`)
        }
      } catch (error) {
        console.error('Error filtering products:', error)
        toast.error('Không thể tải sản phẩm của nhà cung cấp')
      }
    } else {
      setSupplierProducts([])
    }
  }

  const handleQuantityChange = (id: number, quantity: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, quantity, total: quantity * item.price }
        return updatedItem
      }
      return item
    }))
  }

  const handleSubmit = async () => {
    // Validate form
     if (!supplierId) {
       toast.error('Vui lòng chọn nhà cung cấp')
       return
     }

     if (items.some(item => !item.product || item.quantity === 0 || item.price === 0)) {
       toast.error('Vui lòng điền đầy đủ thông tin sản phẩm')
      return
    }

    try {
      // Prepare import data to match backend API
      const importData = {
        supplierId: parseInt(supplierId),
        agencyId: null,
        shipDate: new Date().toISOString().split('T')[0],
        receiveDate: new Date().toISOString().split('T')[0],
        notes: `Nhập hàng từ nhà cung cấp: ${supplierName}`,
        products: items.map(item => {
          const product = supplierProducts.find(p => p.name === item.product)
          return {
            productId: product?.id,
            batch: `BATCH${Date.now()}`,
            mfgDate: new Date().toISOString().split('T')[0],
            expDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            quantity: item.quantity,
            price: item.price
          }
        })
      }

      console.log('Creating import:', importData)
      
      const response = await importService.create(importData)
      
      if (response.success) {
        toast.success('Tạo phiếu nhập thành công!')
        navigate('/staff/receive-goods')
      } else {
        toast.error(response.message || 'Không thể tạo phiếu nhập')
      }
    } catch (error: any) {
      console.error('Error creating import:', error)
      toast.error('Lỗi khi tạo phiếu nhập: ' + (error.response?.data?.message || error.message || 'Unknown error'))
    }
  }

  const handleCancel = () => {
    navigate('/staff/receive-goods')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  return (
    <div className="create-receipt-page">
      <div className="create-receipt-container">
        {/* Header */}
        <div className="create-receipt-header">
          <Package size={32} />
          <h1 className="create-receipt-title">Tạo phiếu nhập mới</h1>
          <button className="create-receipt-btn-back" onClick={handleCancel}>
            Trở lại
          </button>
        </div>

        {/* Form */}
        <div className="create-receipt-form">
          {/* Date */}
           {/* Supplier */}
           <div className="create-receipt-form-section">
             <label className="create-receipt-form-label">Nhà cung cấp</label>
             <select
               className="create-receipt-form-select"
               value={supplierId}
               onChange={(e) => handleSupplierChange(e.target.value)}
             >
               <option value="">Chọn nhà cung cấp</option>
               {suppliers.map((supplier) => (
                 <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
               ))}
             </select>
           </div>

          {/* Products List */}
          <div className="create-receipt-products-section">
            <h3 className="create-receipt-section-title">Danh sách sản phẩm</h3>

            <div className="create-receipt-products-table-wrapper">
              <table className="create-receipt-products-table">
                <thead>
                  <tr>
                    <th className="col-product">Sản phẩm</th>
                    <th className="col-unit">Đơn vị</th>
                    <th className="col-quantity">Số lượng</th>
                     <th className="col-price">Đơn giá</th>
                    <th className="col-total">Thành tiền</th>
                    <th className="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="col-product">
                        <select
                          className="create-receipt-product-select"
                          value={item.product}
                          onChange={(e) => handleProductChange(item.id, e.target.value)}
                           disabled={!supplierId}
                        >
                          <option value="">Chọn sản phẩm</option>
                            {supplierProducts.map((product) => (
                            <option key={product.id || product.code} value={product.name}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="col-unit">
                        <span className="create-receipt-unit-value">{item.unit || '--'}</span>
                      </td>
                      <td className="col-quantity">
                        <input
                          type="number"
                          className="create-receipt-quantity-input"
                          value={item.quantity || ''}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          min="0"
                            disabled={!supplierId || !item.product}
                        />
                      </td>
                        <td className="col-price">
                          <input
                            type="number"
                            className="create-receipt-price-input"
                            value={item.price || ''}
                            onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                            min="0"
                            disabled={!supplierId || !item.product}
                            readOnly
                          />
                        </td>
                      <td className="col-total">
                          <span className="create-receipt-total-value">{formatCurrency(item.total)}</span>
                      </td>
                      <td className="col-action">
                        <button
                          className="create-receipt-btn-remove-item"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={items.length === 1}
                          title="Xóa"
                        >
                          <X size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button className="create-receipt-btn-add-product" onClick={handleAddItem}>
              <Plus size={20} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          {/* Total */}
          <div className="create-receipt-total-section">
            <span className="create-receipt-total-label">Tổng tiền:</span>
            <span className="create-receipt-total-amount">{formatCurrency(calculateTotal())}</span>
          </div>

          {/* Action Buttons */}
          <div className="create-receipt-form-actions">
            <button className="create-receipt-btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button className="create-receipt-btn-submit" onClick={handleSubmit}>
              Tạo phiếu nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateReceipt



