import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { regulationService } from '../../../api/endpoints/regulationService';
import './ViewRegulation.css';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

const ViewRegulation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [regulation, setRegulation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchRegulation();
  }, [id]);

  const fetchRegulation = async () => {
    try {
      setLoading(true);
      const response = await regulationService.getById(id!);
      if (response.success) {
        setRegulation({
          id: response.data.code,
          value: response.data.value,
          description: response.data.description || response.data.name,
          updatedAt: response.data.updatedAt
        });
      }
    } catch (error: any) {
      console.error('Error fetching regulation:', error);
      toast.error('Không thể tải thông tin quy định');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;
  if (!regulation) return <div style={{padding: '2rem'}}>Không tìm thấy quy định</div>;
  return (
    <div className="view-regulation-wrapper">

      <div className="view-regulation-card">
        {/* --- Header --- */}
        <div className="view-regulation-header view-regulation-header--with-back">
          <div className="view-regulation-header-row">
            <h1 className="view-regulation-title">Chi tiết quy định</h1>
            <button className="view-regulation__back-button" onClick={() => navigate('/staff/regulations')}>
              <ArrowLeft size={20} />
              Quay lại
            </button>
          </div>
          <p className="view-regulation-subtitle">
            Xem thông tin chi tiết và lịch sử cập nhật của quy định hệ thống.
          </p>
          <div className="view-regulation-updated">
            <Calendar size={14} />
            <span>Cập nhật lần cuối: {formatDate(regulation.updatedAt)}</span>
          </div>
        </div>
        {/* --- Nội dung --- */}
        <div className="view-regulation-content">
          {/* BỐ CỤC MỚI: Dạng danh sách_chi_tiết */}
          <div className="view-regulation-fields">
            <div className="field-item">
              <label>Mã quy định</label>
              <span className="field-value">{regulation.id}</span>
            </div>
            
            <div className="field-item">
              <label>Giá trị</label>
              <span className="field-value is-numeric">
                {/* Format số cho dễ đọc */}
                {Number(regulation.value).toLocaleString('vi-VN')}
              </span>
            </div>

            <div className="field-item is-full-width">
              <label>Mô tả</label>
              <span className="field-value is-description">
                {regulation.description}
              </span>
            </div>
          </div>

          {/* DI CHUYỂN "Lưu ý" XUỐNG ĐÂY */}
          <div className="view-regulation-note">
            <AlertTriangle size={20} className="view-regulation-note-icon" />
            <div>
              <b>Lưu ý</b>
              <p>Bạn chỉ có quyền xem thông tin quy định. Để thay đổi giá trị, vui lòng liên hệ quản trị viên.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRegulation;


