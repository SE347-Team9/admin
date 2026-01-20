import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Pencil, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { agencyService } from '../../../api/endpoints/agencyService';
import './EditAgency.css';

const agencyTypes = ['Đại lý cấp 1', 'Đại lý cấp 2', 'Đại lý cấp 3'];
const districts = ['Đống Đa', 'Ba Đình', 'Cầu Giấy', 'Hai Bà Trưng'];
const statuses = ['Hoạt động', 'Ngừng hoạt động'];

const EditAgency = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: '',
    type: 'Đại lý cấp 2',
    name: '',
    district: 'Đống Đa',
    manager: '',
    address: '',
    phone: '',
    email: '',
    credit: '',
    status: 'Hoạt động'
  });

  useEffect(() => {
    if (id) fetchAgency();
  }, [id]);

  const fetchAgency = async () => {
    try {
      setLoading(true);
      const response = await agencyService.getById(id!);
      if (response.success) {
        setForm({
          code: response.data.code,
          type: 'Đại lý cấp 2',
          name: response.data.name,
          district: 'Đống Đa',
          manager: '',
          address: response.data.address,
          phone: response.data.phone || '',
          email: response.data.email || '',
          credit: '',
          status: response.data.status === 'active' ? 'Hoạt động' : 'Ngừng hoạt động'
        });
      }
    } catch (error: any) {
      console.error('Error fetching agency:', error);
      toast.error('Không thể tải thông tin đại lý');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await agencyService.update(id!, {
        name: form.name,
        address: form.address,
        phone: form.phone,
        email: form.email,
        status: form.status === 'Hoạt động' ? 'active' : 'inactive'
      });
      if (response.success) {
        toast.success('Cập nhật đại lý thành công!');
        navigate('/staff/agency-management');
      }
    } catch (error: any) {
      console.error('Error updating agency:', error);
      toast.error('Không thể cập nhật đại lý');
    }
  };

  const handleCancel = () => navigate('/staff/agency-management');

  return (
    <div className="edit-agency-wrapper">
      <div className="edit-agency-header">
        <div className="edit-agency-header-icon">
          <Pencil size={36} />
        </div>
        <div className="edit-agency-header-content">
          <h1 className="edit-agency-title">CHỈNH SỬA ĐẠI LÝ</h1>
          <p className="edit-agency-desc">Cập nhật thông tin đại lý {form.code}</p>
        </div>
        <button className="edit-agency-back-btn" onClick={handleCancel}>
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>
      <div className="edit-agency-card">
        <form className="edit-agency-form" onSubmit={handleSubmit}>
          <div className="edit-agency-grid">
            <div className="edit-agency-group">
              <label className="edit-agency-label">Mã đại lý <span>*</span></label>
              <input name="code" value={form.code} onChange={handleChange} className="edit-agency-input" required />
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Loại đại lý <span>*</span></label>
              <select name="type" value={form.type} onChange={handleChange} className="edit-agency-input" required>
                {agencyTypes.map(type => <option key={type}>{type}</option>)}
              </select>
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Tên đại lý <span>*</span></label>
              <input name="name" value={form.name} onChange={handleChange} className="edit-agency-input" required />
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Quận/Huyện <span>*</span></label>
              <select name="district" value={form.district} onChange={handleChange} className="edit-agency-input" required>
                {districts.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Người quản lý <span>*</span></label>
              <input name="manager" value={form.manager} onChange={handleChange} className="edit-agency-input" required />
            </div>
            <div className="edit-agency-group edit-agency-group--full">
              <label className="edit-agency-label">Địa chỉ <span>*</span></label>
              <input name="address" value={form.address} onChange={handleChange} className="edit-agency-input" required />
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Số điện thoại <span>*</span></label>
              <input name="phone" value={form.phone} onChange={handleChange} className="edit-agency-input" required />
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Email <span>*</span></label>
              <input name="email" value={form.email} onChange={handleChange} className="edit-agency-input" required />
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Hạn mức tín dụng (VND) <span>*</span></label>
              <input name="credit" value={form.credit} onChange={handleChange} className="edit-agency-input" required disabled />
              <span className="edit-agency-note">Hạn mức được xác định bởi loại đại lý và không thể thay đổi trực tiếp</span>
            </div>
            <div className="edit-agency-group">
              <label className="edit-agency-label">Trạng thái <span>*</span></label>
              <select name="status" value={form.status} onChange={handleChange} className="edit-agency-input" required>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="edit-agency-actions">
            <button type="submit" className="edit-agency-btn edit-agency-btn--primary">
              <Pencil size={18} style={{marginRight: 8}} />
              Cập nhật đại lý
            </button>
            <button type="button" className="edit-agency-btn edit-agency-btn--secondary" onClick={handleCancel}>
              <ArrowLeft size={18} style={{marginRight: 8}} />
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAgency;



