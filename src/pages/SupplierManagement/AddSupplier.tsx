import {
  Truck,
  Save,
  X,
  MapPin,
  User,
  CreditCard,
  Phone,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "./AddSupplier.css";

const AddSupplier = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    status: "active",
  });

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

    // TODO: Call API to create supplier
    toast.success("Thêm nhà cung cấp thành công!");
    navigate("/supplier-management");
  };

  const handleCancel = () => {
    navigate("/supplier-management");
  };

  return (
    <div className="add-supplier-page">
      <div className="add-supplier-header">
        <div className="header-icon-box">
          <Truck size={36} />
        </div>
        <div className="header-text">
          <h1 className="add-supplier-title">Thêm nhà cung cấp mới</h1>
          <p className="add-supplier-subtitle">
            Tạo nhà cung cấp mới và thiết lập thông tin chi tiết
          </p>
        </div>
      </div>

      <div className="add-supplier-form-container">
        <form onSubmit={handleSubmit} className="add-supplier-form">
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
                  placeholder="Nhập mã NCC (VD: NCC001)"
                  required
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
              Lưu nhà cung cấp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
