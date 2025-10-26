import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Frown } from 'lucide-react'
import './NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/agency-management')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="not-found-page">
      <div className="not-found__container">
        {/* Animated 404 */}
        <div className="not-found__number">
          <span className="not-found__digit not-found__digit--1">4</span>
          <span className="not-found__digit not-found__digit--0">
            <Frown className="not-found__icon" size={120} />
          </span>
          <span className="not-found__digit not-found__digit--2">4</span>
        </div>

        {/* Error Message */}
        <div className="not-found__content">
          <h1 className="not-found__title">Không Tìm Thấy Trang</h1>
          <p className="not-found__description">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <p className="not-found__suggestion">
            Hãy kiểm tra lại URL hoặc quay về trang chủ để tiếp tục.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="not-found__actions">
          <button 
            className="not-found__btn not-found__btn--back"
            onClick={handleGoBack}
          >
            <ArrowLeft size={20} />
            <span>Quay Lại</span>
          </button>
          <button 
            className="not-found__btn not-found__btn--home"
            onClick={handleGoHome}
          >
            <Home size={20} />
            <span>Về Trang Chủ</span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="not-found__decoration">
          <div className="not-found__circle not-found__circle--1"></div>
          <div className="not-found__circle not-found__circle--2"></div>
          <div className="not-found__circle not-found__circle--3"></div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
