import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Package, Plus, X, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import importService from '../../../api/endpoints/importService'
import { productService } from '../../../api/endpoints/productService'
import { agencyService } from '../../../api/endpoints/agencyService'
import './EditReceiveOrder.css'

interface ReceiveOrderItem {
  id: number
  product: string
  unit: string
  warehouse: string
  quantity: number
  price: number
  mfgDate: string
  expDate: string
  total: number
}

const EditReceiveOrder = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [manufacturer, setManufacturer] = useState('')
  const [items, setItems] = useState<ReceiveOrderItem[]>([])
  const [agencies, setAgencies] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [importRes, agencyRes, productRes] = await Promise.all([
        importService.getById(parseInt(id!)),
        agencyService.getAll(),
        productService.getAll()
      ])

      if (agencyRes.success) setAgencies(agencyRes.data)
      if (productRes.success) setProducts(productRes.data)

      if (importRes.success && importRes.data) {
        const imp = importRes.data
        setManufacturer(imp.agency_name || '')
        setItems(imp.products?.map((p: any) => ({
          id: p.product_id,
          product: p.product_name || '',
          unit: p.unit || '',
          warehouse: 'Kho thường',
          quantity: p.quantity,
          price: p.price,
          mfgDate: '2024-01-01',
          expDate: '2025-01-01',
          total: p.quantity * p.price
        })) || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const warehouses = ['Kho thường', 'Kho mát', 'Kho đông lạnh']

  if (loading) {
    return <div className="edit-receive-order-page"><p>Đang tải...</p></div>
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleAddItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: newId, product: '', unit: '', warehouse: '', quantity: 0, price: 0, mfgDate: '', expDate: '', total: 0 }])
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

  const handleWarehouseChange = (id: number, warehouse: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, warehouse }
      }
      return item
    }))
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

  const handleMfgDateChange = (id: number, mfgDate: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, mfgDate }
      }
      return item
    }))
  }

  const handleExpDateChange = (id: number, expDate: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, expDate }
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

    if (items.some(item => !item.product || !item.warehouse || item.quantity === 0 || item.price === 0 || !item.mfgDate || !item.expDate)) {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm')
      return
    }

    const receiveOrderData = {
      id,
      manufacturer,
      items,
      total: calculateTotal()
    }

    console.log('Updated receive order data:', receiveOrderData)
    // TODO: Call API to update receive order
    alert('Cập nhật phiếu nhận thành công!')
    navigate('/staff/receive-management')
  }

  const handleCancel = () => {
    navigate('/staff/receive-management')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND'
  }

  return (
    <div className="edit-receive-order-page">
      <div className="edit-receive-order-container">
        {/* Header */}
        <div className="edit-receive-order-header">
          <Package size={32} />
          <h1 className="edit-receive-order-title">Chỉnh sửa phiếu nhận</h1>
          <button className="btn-back" onClick={handleCancel}>
            <ArrowLeft size={20} />
            Trở lại
          </button>
        </div>

        {/* Form */}
        <div className="edit-receive-order-form">
          {/* Manufacturer */}
          <div className="form-section">
            <label className="form-label">Nhà sản xuất</label>
            <select
              className="form-select"
              value={manufacturer}
              onChange={(e) => {
                setManufacturer(e.target.value)
                // reset items when change manufacturer
                setItems([{ id: 1, product: '', unit: '', warehouse: '', quantity: 0, price: 0, mfgDate: '', expDate: '', total: 0 }])
              }}
            >
              <option value="">Chọn nhà sản xuất</option>
              {manufacturers.map((m) => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Products List */}
          <div className="products-section">
            <h3 className="section-title">Danh sách sản phẩm</h3>

            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="col-product">Sản phẩm</th>
                    <th className="col-unit">Đơn vị</th>
                    <th className="col-warehouse">Kho</th>
                    <th className="col-quantity">Số lượng</th>
                    <th className="col-price">Đơn giá</th>
                    <th className="col-date">NSX</th>
                    <th className="col-date">HSD</th>
                    <th className="col-total">Thành tiền</th>
                    <th className="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="col-product">
                        <select
                          className="product-select"
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
                        <span className="unit-value">{item.unit || '--'}</span>
                      </td>
                      <td className="col-warehouse">
                        <select
                          className="warehouse-select"
                          value={item.warehouse}
                          onChange={(e) => handleWarehouseChange(item.id, e.target.value)}
                          disabled={!manufacturer}
                        >
                          <option value="">Chọn kho</option>
                          {warehouses.map((wh) => (
                            <option key={wh} value={wh}>{wh}</option>
                          ))}
                        </select>
                      </td>
                      <td className="col-quantity">
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity || ''}
                          onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                          min="0"
                          disabled={!manufacturer}
                        />
                      </td>
                      <td className="col-price">
                        <input
                          type="number"
                          className="price-input"
                          value={item.price || ''}
                          onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                          min="0"
                          disabled={!manufacturer}
                        />
                      </td>
                      <td className="col-date">
                        <input
                          type="date"
                          className="date-input"
                          value={item.mfgDate}
                          onChange={(e) => handleMfgDateChange(item.id, e.target.value)}
                          disabled={!manufacturer}
                        />
                      </td>
                      <td className="col-date">
                        <input
                          type="date"
                          className="date-input"
                          value={item.expDate}
                          onChange={(e) => handleExpDateChange(item.id, e.target.value)}
                          disabled={!manufacturer}
                        />
                      </td>
                      <td className="col-total">
                        <span className="total-value">{formatCurrency(item.total)}</span>
                      </td>
                      <td className="col-action">
                        <button
                          className="btn-remove-item"
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

            <button className="btn-add-product" onClick={handleAddItem}>
              <Plus size={20} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          {/* Total */}
          <div className="total-section">
            <span className="total-label">Tổng tiền:</span>
            <span className="total-amount">{formatCurrency(calculateTotal())}</span>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button className="btn-cancel" onClick={handleCancel}>
              Hủy
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              Cập nhật phiếu nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditReceiveOrder



