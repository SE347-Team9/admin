import './ViewAgency.css';
import { Building2, User, Phone, MapPin, Mail, Tag, Layers, CircleCheck, CalendarClock, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { agencyService } from '../../../api/endpoints/agencyService';
import { toast } from 'react-toastify';

const ViewAgency = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchAgency();
  }, [id]);

  const fetchAgency = async () => {
    try {
      setLoading(true);
      const response = await agencyService.getById(id!);
      if (response.success) {
        setAgency({
          name: response.data.name,
          representative: 'N/A',
          phone: response.data.phone || '',
          address: response.data.address,
          email: response.data.email || '',
          code: response.data.code,
          type: 'Cấp 1',
          status: response.data.status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động',
          createdAt: new Date(response.data.createdAt).toLocaleDateString('vi-VN')
        });
      }
    } catch (error: any) {
      console.error('Error fetching agency:', error);
      toast.error('Không thể tải thông tin đại lý');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: '2rem'}}>Loading...</div>;
  if (!agency) return <div style={{padding: '2rem'}}>Không tìm thấy đại lý</div>;
  return (
    <div className="view-agency-root">
      <div className="view-agency-header-new">
        <div className="view-agency-header-icon-big">
          <Building2 size={48} />
        </div>
        <div className="view-agency-header-title-group">
          <h1 className="view-agency-title">Thông Tin Đại Lý</h1>
          <div className="view-agency-desc">Xem chi tiết đại lý: <b>{agency.name}</b></div>
        </div>
        <button className="view-agency-back-btn" onClick={() => navigate('/staff/agency-management')}>
          <ArrowLeft size={20} style={{marginRight: 6}} /> Quay lại
        </button>
      </div>
      <div className="view-agency-card-new">
        <div className="view-agency-info-grid">
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><User size={20}/> Người đại diện</span>
            <span className="view-agency-info-value">{agency.representative}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Phone size={20}/> Số điện thoại</span>
            <span className="view-agency-info-value">{agency.phone}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><MapPin size={20}/> Địa chỉ</span>
            <span className="view-agency-info-value">{agency.address}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Mail size={20}/> Email</span>
            <span className="view-agency-info-value">{agency.email}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Tag size={20}/> Mã đại lý</span>
            <span className="view-agency-info-value">{agency.code}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><Layers size={20}/> Loại đại lý</span>
            <span className="view-agency-info-value">{agency.type}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><CircleCheck size={20}/> Trạng thái</span>
            <span className="view-agency-info-value view-agency-status-active">{agency.status}</span>
          </div>
          <div className="view-agency-info-item">
            <span className="view-agency-info-label"><CalendarClock size={20}/> Ngày tạo</span>
            <span className="view-agency-info-value">{agency.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgency;



