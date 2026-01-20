import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { productService } from '../../../api/endpoints/productService'
import { agencyService } from '../../../api/endpoints/agencyService'
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
  const [manufacturer, setManufacturer] = useState('')
  const [items, setItems] = useState<ReceiptItem[]>([
    { id: 1, product: '', unit: '', quantity: 0, price: 0, total: 0 }
  ])
  const [agencies, setAgencies] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [agencyRes, productRes] = await Promise.all([
        agencyService.getAll(),
        productService.getAll()
      ])
      if (agencyRes.success) setAgencies(agencyRes.data)
      if (productRes.success) setProducts(productRes.data)
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
     const selectedProduct = currentProducts.find(p => p.name === productName)
    if (selectedProduct) {
      setItems(items.map(item => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            product: productName,
            unit: selectedProduct.unit,
            price: selectedProduct.price,
            total: item.quantity * selectedProduct.price
          }
          return updatedItem
        }
        return item
      }))
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

  const handleSubmit = () => {
    // Validate form
     if (!manufacturer) {
       alert('Vui lòng chọn nhà sản xuất')
       return
     }

     if (items.some(item => !item.product || item.quantity === 0 || item.price === 0)) {
       alert('Vui lòng điền đầy đủ thông tin sản phẩm')
      return
    }

    const receiptData = {
       manufacturer,
      items,
      total: calculateTotal()
    }

    console.log('Receipt data:', receiptData)
    // TODO: Call API to save receipt
    alert('Tạo phiếu nhập thành công!')
    navigate('/staff/receive-goods')
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
           {/* Manufacturer */}
           <div className="create-receipt-form-section">
             <label className="create-receipt-form-label">Nhà sản xuất</label>
             <select
               className="create-receipt-form-select"
               value={manufacturer}
               onChange={(e) => {
                 setManufacturer(e.target.value)
                 // reset items when change manufacturer
                 setItems([{ id: 1, product: '', unit: '', quantity: 0, price: 0, total: 0 }])
               }}
             >
               <option value="">Chọn nhà sản xuất</option>
               {manufacturers.map((m) => (
                 <option key={m.name} value={m.name}>{m.name}</option>
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
                           disabled={!manufacturer}
                        >
                          <option value="">Chọn sản phẩm</option>
                            {currentProducts.map((product) => (
                            <option key={product.name} value={product.name}>
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
                            disabled={!manufacturer}
                        />
                      </td>
                        <td className="col-price">
                          <input
                            type="number"
                            className="create-receipt-price-input"
                            value={item.price || ''}
                            onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                            min="0"
                            disabled={!manufacturer}
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



