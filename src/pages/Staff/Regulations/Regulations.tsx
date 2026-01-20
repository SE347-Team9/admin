import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Eye, Search } from 'lucide-react'
import { toast } from 'react-toastify'
import { regulationService } from '../../../api/endpoints/regulationService'
import './Regulations.css'

interface Regulation {
  id: string
  code: string
  value: number
  description: string
  lastUpdated: string
}

const Regulations = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [regulations, setRegulations] = useState<Regulation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRegulations()
  }, [])

  const fetchRegulations = async () => {
    try {
      setLoading(true)
      const response = await regulationService.getAll()
      if (response.success) {
        const transformedData = response.data.map((reg: any) => ({
          id: reg.id,
          code: reg.code,
          value: parseFloat(reg.value) || 0,
          description: reg.description || reg.name || '',
          lastUpdated: new Date(reg.updatedAt).toLocaleString('vi-VN')
        }))
        setRegulations(transformedData)
      }
    } catch (error: any) {
      console.error('Error fetching regulations:', error)
      toast.error('Không thể tải danh sách quy định')
    } finally {
      setLoading(false)
    }
  }

  const filteredRegulations = regulations.filter(regulation =>
    regulation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    regulation.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const navigate = useNavigate();
  const handleView = (id: string) => {
    navigate(`/regulations/view/${id}`)
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



