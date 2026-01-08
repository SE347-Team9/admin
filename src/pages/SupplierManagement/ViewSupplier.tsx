import {
  Truck,
  Edit,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ViewSupplier.css";

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
  statusLabel: string;
  createdAt: string;
}

const ViewSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [supplier, setSupplier] = useState<Supplier | null>(null);

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
      statusLabel: "Hoạt động",
      createdAt: "01/01/2024",
    },
    "2": {
      id: "2",
      code: "NCC002",
      name: "Cty CP Vinamilk",
      contactPerson: "Trần Thị B",
      phone: "0912345678",
      email: "sales@vinamilk.com.vn",
      address: "Số 2, Phố Cầu Giấy, Cầu Giấy, Hà Nội",
      taxCode: "0101345678",
      status: "active",
      statusLabel: "Hoạt động",
      createdAt: "15/02/2024",
    },
  };

  useEffect(() => {
    // Simulate loading supplier data
    if (id && mockSuppliers[id]) {
      setSupplier(mockSuppliers[id]);
    }
    setIsLoading(false);
  }, [id]);

  const getStatusClass = (status: string) => {
    return status === "active" ? "status-active" : "status-inactive";
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? (
      <CheckCircle2 size={16} />
    ) : (
      <CheckCircle2 size={16} />
    );
  };

  if (isLoading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }

  if (!supplier) {
    return (
      <div className="view-supplier-page">
        <div className="no-data">
          <p>Không tìm thấy nhà cung cấp</p>
          <button
            onClick={() => navigate("/supplier-management")}
            className="btn-back-link"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-supplier-page">
      <div className="view-supplier-header">
        <button
          className="btn-back"
          onClick={() => navigate("/supplier-management")}
          title="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="header-icon-box">
          <Truck size={36} />
        </div>
        <div className="header-text">
          <h1 className="view-supplier-title">Chi tiết nhà cung cấp</h1>
          <p className="view-supplier-subtitle">
            Thông tin đầy đủ về nhà cung cấp
          </p>
        </div>
        <button
          className="btn-edit-header"
          onClick={() => navigate(`/edit-supplier/${supplier.id}`)}
        >
          <Edit size={20} />
          Chỉnh sửa
        </button>
      </div>

      <div className="view-supplier-container">
        {/* Basic Info Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>
              <Building2 size={24} />
              Thông tin cơ bản
            </h3>
            <span className={`status-badge ${getStatusClass(supplier.status)}`}>
              {getStatusIcon(supplier.status)}
              {supplier.statusLabel}
            </span>
          </div>
          <div className="info-grid">
            <div className="info-item">
              <label>Mã NCC</label>
              <span className="info-code">{supplier.code}</span>
            </div>
            <div className="info-item">
              <label>Tên công ty</label>
              <span>{supplier.name}</span>
            </div>
            <div className="info-item">
              <label>Mã số thuế</label>
              <span>{supplier.taxCode || "Chưa cập nhật"}</span>
            </div>
            <div className="info-item">
              <label>Ngày tạo</label>
              <span>{supplier.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>
              <Phone size={24} />
              Thông tin liên hệ
            </h3>
          </div>
          <div className="info-grid">
            <div className="info-item full-width">
              <label>Người liên hệ</label>
              <span>{supplier.contactPerson}</span>
            </div>
            <div className="info-item">
              <label>Số điện thoại</label>
              <span className="contact-link">
                <Phone size={16} />
                <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
              </span>
            </div>
            <div className="info-item">
              <label>Email</label>
              <span className="contact-link">
                <Mail size={16} />
                <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
              </span>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="info-card">
          <div className="card-header">
            <h3>
              <MapPin size={24} />
              Địa chỉ
            </h3>
          </div>
          <div className="info-full">
            <p>{supplier.address}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="view-actions">
          <button
            className="btn-back-link"
            onClick={() => navigate("/supplier-management")}
          >
            <ArrowLeft size={20} />
            Quay lại danh sách
          </button>
          <button
            className="btn-edit-action"
            onClick={() => navigate(`/edit-supplier/${supplier.id}`)}
          >
            <Edit size={20} />
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSupplier;
