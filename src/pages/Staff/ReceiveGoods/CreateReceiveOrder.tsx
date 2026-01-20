import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Plus, X, Upload } from 'lucide-react'
import * as XLSX from 'xlsx'
import './CreateReceiveOrder.css'

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

const CreateReceiveOrder = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [manufacturer, setManufacturer] = useState('')
  const [items, setItems] = useState<ReceiveOrderItem[]>([
    { id: 1, product: '', unit: '', warehouse: '', quantity: 0, price: 0, mfgDate: '', expDate: '', total: 0 }
  ])

  // Mock manufacturers and products
  const manufacturers = [
    {
      name: 'Công ty A',
      products: [
        { name: 'Bia Hà Nội', unit: 'Thùng', price: 250000 },
        { name: 'Nước ngọt Coca', unit: 'Chai', price: 10000 },
        { name: 'Snack Oishi', unit: 'Gói', price: 12000 }
      ]
    },
    {
      name: 'Công ty B',
      products: [
        { name: 'Gạo ST25', unit: 'Kg', price: 25000 },
        { name: 'Sữa Vinamilk', unit: 'Lốc', price: 60000 },
        { name: 'Nước ngọt Pepsi', unit: 'Lon', price: 9000 }
      ]
    }
  ]

  const warehouses = ['Kho thường', 'Kho mát', 'Kho đông lạnh']

  const currentProducts = manufacturer
    ? manufacturers.find(m => m.name === manufacturer)?.products || []
    : []

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

  const convertExcelDate = (excelDateValue: any): string => {
    if (!excelDateValue) return ''
    
    // If it's already a date string in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (typeof excelDateValue === 'string') {
      const parts = excelDateValue.split('/')
      if (parts.length === 3) {
        const [day, month, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
    }
    
    // If it's a number (Excel serial date), convert it
    if (typeof excelDateValue === 'number') {
      const excelDateStart = new Date(1900, 0, 1)
      const excelDate = new Date(excelDateStart.getTime() + (excelDateValue - 1) * 24 * 60 * 60 * 1000)
      const year = excelDate.getFullYear()
      const month = String(excelDate.getMonth() + 1).padStart(2, '0')
      const day = String(excelDate.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    return ''
  }

  const handleImportExcel = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as ArrayBuffer
        const workbook = XLSX.read(data, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        if (jsonData.length === 0) {
          alert('File Excel không có dữ liệu')
          return
        }

        // Convert Excel data to items format
        const importedItems: ReceiveOrderItem[] = jsonData.map((row, index) => {
          const product = row['Sản phẩm'] || row['Product'] || ''
          const quantity = Number(row['Số lượng'] || row['Quantity'] || 0)
          const price = Number(row['Đơn giá'] || row['Unit Price'] || 0)
          let warehouse = row['Kho'] || row['Warehouse'] || ''
          
          // Normalize warehouse name to match warehouses list
          if (warehouse) {
            const warehouseLower = warehouse.toLowerCase().trim()
            // Map common warehouse names
            if (warehouseLower.includes('thường')) {
              warehouse = 'Kho thường'
            } else if (warehouseLower.includes('mát')) {
              warehouse = 'Kho mát'
            } else if (warehouseLower.includes('đông') || warehouseLower.includes('lạnh')) {
              warehouse = 'Kho đông lạnh'
            } else {
              warehouse = ''
            }
          }
          
          const mfgDate = convertExcelDate(row['NSX'] || row['Manufacturing Date'] || '')
          const expDate = convertExcelDate(row['HSD'] || row['Expiry Date'] || '')

          return {
            id: index + 1,
            product,
            unit: '', // Unit sẽ được tự động điền từ currentProducts
            warehouse,
            quantity,
            price,
            mfgDate,
            expDate,
            total: quantity * price
          }
        })

        // Try to match units from currentProducts
        const matchedItems = importedItems.map(item => {
          const matchedProduct = currentProducts.find(p => p.name === item.product)
          return {
            ...item,
            unit: matchedProduct?.unit || ''
          }
        })

        setItems(matchedItems)
        alert(`Đã import thành công ${matchedItems.length} sản phẩm`)
      } catch (error) {
        console.error('Error importing Excel:', error)
        alert('Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file.')
      }
    }

    reader.readAsArrayBuffer(file)
    // Reset input để có thể chọn file cùng tên lần nữa
    event.target.value = ''
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
      manufacturer,
      items,
      total: calculateTotal()
    }

    console.log('Receive order data:', receiveOrderData)
    // TODO: Call API to save receive order
    alert('Tạo phiếu nhận thành công!')
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
          <h1 className="create-receipt-title">Tạo phiếu nhận mới</h1>
          <button className="btn-back" onClick={handleCancel}>
            Trở lại
          </button>
        </div>

        {/* Form */}
        <div className="create-receipt-form">
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
            <div className="section-header">
              <h3 className="section-title">Danh sách sản phẩm</h3>
              <button className="btn-import-excel" onClick={handleImportExcel} disabled={!manufacturer}>
                <Upload size={20} />
                <span>Import từ Excel</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

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
                        {manufacturer ? (
                          <select
                            className="warehouse-select"
                            value={item.warehouse}
                            onChange={(e) => handleWarehouseChange(item.id, e.target.value)}
                          >
                            <option value="">Chọn kho</option>
                            {warehouses.map((wh) => (
                              <option key={wh} value={wh}>{wh}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="warehouse-placeholder">--</span>
                        )}
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
              Tạo phiếu nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateReceiveOrder



