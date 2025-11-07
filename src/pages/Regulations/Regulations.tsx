import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Eye, Search, Edit, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import './Regulations.css'

interface Regulation {
  id: string
  code: string
  value: number
  description: string
  lastUpdated: string
}

const Regulations = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data
  const regulations: Regulation[] = [
    {
      id: '1',
      code: 'max_debt_level_1',
      value: 100000000,
      description: 'Trần nợ đại lý cấp 1',
      lastUpdated: '21:35 11 thg 7, 2025'
    },
    {
      id: '2',
      code: 'max_debt_level_2',
      value: 50000000,
      description: 'Trần nợ đại lý cấp 2',
      lastUpdated: '21:35 11 thg 7, 2025'
    },
    {
      id: '3',
      code: 'max_delivery_order',
      value: 10,
      description: 'Số lượng đơn hàng tối đa trên ngày',
      lastUpdated: '10:20 05 thg 10, 2025'
    },
    {
      id: '4',
      code: 'min_order_value',
      value: 5000000,
      description: 'Giá trị đơn hàng tối thiểu',
      lastUpdated: '15:45 28 thg 10, 2025'
    }
  ]

  const filteredRegulations = regulations.filter(regulation =>
    regulation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    regulation.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const handleView = (id: string) => {
    navigate(`/view-regulation/${id}`)
  }

  const handleEdit = (id: string) => {
    navigate(`/edit-regulation/${id}`)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quy định này?')) {
      toast.success('Xóa quy định thành công')
    }
  }

  return (
    <div className="regulations-page">
      {/* Header Section */}
      <div className="regulations__header">
        <div className="regulations__header-icon">
          <BookOpen size={36} />
        </div>
        <div className="regulations__header-text">
          <h1 className="regulations__title">Quy định hệ thống</h1>
          <p className="regulations__subtitle">Xem các quy định và chính sách được thiết lập bởi quản trị viên</p>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="regulations__actions-card">
        <div className="regulations__search-box">
          <Search className="regulations__search-icon" size={20} />
          <input
            type="text"
            className="regulations__search-input"
            placeholder="Tìm kiếm quy định..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Regulations Table */}
      <div className="regulations__table-card">
        <table className="regulations__table">
          <thead>
            <tr>
              <th className="regulations__col-code">MÃ QUY ĐỊNH</th>
              <th className="regulations__col-value">GIÁ TRỊ</th>
              <th className="regulations__col-description">MÔ TẢ</th>
              <th className="regulations__col-updated">CẬP NHẬT LẦN CUỐI</th>
              <th className="regulations__col-actions">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegulations.length > 0 ? (
              filteredRegulations.map((regulation) => (
                <tr key={regulation.id}>
                  <td className="regulations__col-code">
                    <span className="regulations__code">{regulation.code}</span>
                  </td>
                  <td className="regulations__col-value">
                    <span className="regulations__value">{formatNumber(regulation.value)}</span>
                  </td>
                  <td className="regulations__col-description">{regulation.description}</td>
                  <td className="regulations__col-updated">{regulation.lastUpdated}</td>
                  <td className="regulations__col-actions">
                    <div className="regulations__action-buttons">
                      <button
                        className="regulations__action-btn regulations__action-btn--view"
                        onClick={() => handleView(regulation.id)}
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="regulations__action-btn regulations__action-btn--edit"
                        onClick={() => handleEdit(regulation.id)}
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="regulations__action-btn regulations__action-btn--delete"
                        onClick={() => handleDelete(regulation.id)}
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
                <td colSpan={5} className="regulations__no-data">
                  <BookOpen size={48} />
                  <p>Không tìm thấy quy định nào</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Regulations
