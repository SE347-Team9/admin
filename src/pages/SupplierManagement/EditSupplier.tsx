import { Truck, Save, X, MapPin, User, Phone, Mail } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./EditSupplier.css";

interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  status: "active" | "inactive";
}

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState<Supplier>({
    id: "",
    code: "",
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    status: "active",
  });

  // Mock data - in real app, fetch from API
  const mockSuppliers: { [key: string]: Supplier } = {
    "1": {
      id: "1",
      code: "NCC001",
      name: "Cty TNHH Masan",
      contactPerson: "Nguyễn Văn A",
      phone: "0901234567",
      email: "contact@masan.com.vn",
      address: "Số 1, Phố Láng, Đống Đa, Hà Nội",
      taxCode: "0101234567",
      status: "active",
    },
  };

  useEffect(() => {
    // Simulate loading supplier data
    if (id && mockSuppliers[id]) {
      setFormData(mockSuppliers[id]);
    }
    setIsLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.code ||
      !formData.name ||
      !formData.contactPerson ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ! (10-11 chữ số)");
      return;
    }

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Email không hợp lệ!");
        return;
      }
    }

    if (
      formData.taxCode &&
      !/^[0-9]{10}$/.test(formData.taxCode.replace(/-/g, ""))
    ) {
      toast.error("Mã số thuế không hợp lệ! (10 chữ số)");
      return;
    }

    // TODO: Call API to update supplier
    toast.success("Cập nhật nhà cung cấp thành công!");
    navigate("/supplier-management");
  };

  const handleCancel = () => {
    navigate("/supplier-management");
  };

  if (isLoading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="edit-supplier-page">
      <div className="edit-supplier-header">
        <div className="header-icon-box">
          <Truck size={36} />
        </div>
        <div className="header-text">
          <h1 className="edit-supplier-title">Chỉnh sửa nhà cung cấp</h1>
          <p className="edit-supplier-subtitle">
            Cập nhật thông tin nhà cung cấp
          </p>
        </div>
      </div>

      <div className="edit-supplier-form-container">
        <form onSubmit={handleSubmit} className="edit-supplier-form">
          {/* Thông tin cơ bản */}
          <div className="form-section">
            <h3 className="section-title">
              <Truck size={20} />
              Thông tin cơ bản
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="code">
                  Mã NCC <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Nhập mã NCC"
                  disabled
                  title="Mã NCC không thể chỉnh sửa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">
                  Tên công ty <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên công ty"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="taxCode">Mã số thuế</label>
                <input
                  type="text"
                  id="taxCode"
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleChange}
                  placeholder="Nhập mã số thuế (10 chữ số)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">
                  Trạng thái <span className="required">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="form-section">
            <h3 className="section-title">
              <User size={20} />
              Thông tin liên hệ
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contactPerson">
                  Người liên hệ <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Nhập tên người liên hệ"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <div className="input-group">
                  <Phone size={18} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0901234567"
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Email</label>
                <div className="input-group">
                  <Mail size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@company.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Địa chỉ */}
          <div className="form-section">
            <h3 className="section-title">
              <MapPin size={20} />
              Địa chỉ
            </h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="address">
                  Địa chỉ <span className="required">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ chi tiết"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <X size={20} />
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              <Save size={20} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupplier;
