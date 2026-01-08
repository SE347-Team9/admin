import {
  Truck,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import "./SupplierManagement.css";

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

const SupplierManagement = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  // Statistics data
  const totalSuppliers = 5;
  const activeSuppliers = 4;
  const inactiveSuppliers = 1;

  // Mock data
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
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
    {
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
    {
      id: "3",
      code: "NCC003",
      name: "Cty TNHH Unilever Việt Nam",
      contactPerson: "Lê Văn C",
      phone: "0923456789",
      email: "suppliers@unilever.com.vn",
      address: "Số 3, Phố Thống Nhất, Đống Đa, Hà Nội",
      taxCode: "0101456789",
      status: "inactive",
      statusLabel: "Ngừng hoạt động",
      createdAt: "20/03/2024",
    },
    {
      id: "4",
      code: "NCC004",
      name: "Cty TNHH Nestlé Việt Nam",
      contactPerson: "Phạm Thị D",
      phone: "0934567890",
      email: "procurement@nestle.com.vn",
      address: "Số 4, Phố Tây Sơn, Đống Đa, Hà Nội",
      taxCode: "0101567890",
      status: "active",
      statusLabel: "Hoạt động",
      createdAt: "10/04/2024",
    },
    {
      id: "5",
      code: "NCC005",
      name: "Cty TNHH Coca-Cola Việt Nam",
      contactPerson: "Trần Văn E",
      phone: "0945678901",
      email: "supplier@cocacola.com.vn",
      address: "Số 5, Phố Khương Thượng, Đống Đa, Hà Nội",
      taxCode: "0101678901",
      status: "active",
      statusLabel: "Hoạt động",
      createdAt: "25/10/2025",
    },
  ]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 size={14} />;
      case "inactive":
        return <XCircle size={14} />;
      default:
        return <CheckCircle2 size={14} />;
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || supplier.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteSupplier = (supplier: Supplier) => {
    setDeleteSupplier(supplier);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteSupplier) {
      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== deleteSupplier.id)
      );
      toast.success(`Đã xóa nhà cung cấp ${deleteSupplier.name}`);
    }
    setShowDeleteModal(false);
    setDeleteSupplier(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteSupplier(null);
  };

  const handleViewSupplier = (supplierId: string) => {
    navigate(`/view-supplier/${supplierId}`);
  };

  const handleEditSupplier = (supplierId: string) => {
    navigate(`/edit-supplier/${supplierId}`);
  };

  return (
    <div className="supplier-management-page">
      {/* Page Header */}
      <div className="supplier-header">
        <div className="header-icon-box">
          <Truck size={36} />
        </div>
        <div className="header-text">
          <h1 className="supplier-title">Quản lý nhà cung cấp</h1>
          <p className="supplier-subtitle">
            Quản lý danh sách nhà cung cấp, cập nhật thông tin liên hệ và trạng
            thái hoạt động.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards-grid">
        <div className="stats-card gradient-blue">
          <div className="stats-card-content">
            <div className="stats-label">Tổng NCC</div>
            <div className="stats-value">{totalSuppliers}</div>
          </div>
          <div className="stats-icon">
            <Truck size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-green">
          <div className="stats-card-content">
            <div className="stats-label">Đang hoạt động</div>
            <div className="stats-value">{activeSuppliers}</div>
          </div>
          <div className="stats-icon">
            <CheckCircle2 size={44} strokeWidth={2.5} />
          </div>
        </div>

        <div className="stats-card gradient-red">
          <div className="stats-card-content">
            <div className="stats-label">Ngừng hoạt động</div>
            <div className="stats-value">{inactiveSuppliers}</div>
          </div>
          <div className="stats-icon">
            <XCircle size={44} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Suppliers List Section */}
      <div className="suppliers-section">
        <div className="section-header">
          <div className="header-left">
            <Truck size={24} />
            <h2>Danh sách nhà cung cấp ({filteredSuppliers.length})</h2>
          </div>
          <button
            className="btn-create-supplier"
            onClick={() => navigate("/add-supplier")}
          >
            <Plus size={20} />
            Thêm mới
          </button>
        </div>

        {/* Search and Filter */}
        <div className="suppliers-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã, tên, người liên hệ hoặc SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-box">
            <label>Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
              className="filter-select"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </div>

        <div className="suppliers-table-container">
          <table className="suppliers-table">
            <thead>
              <tr>
                <th>MÃ NCC</th>
                <th>TÊN CÔNG TY</th>
                <th>NGƯỜI LIÊN HỆ</th>
                <th>SỐ ĐIỆN THOẠI</th>
                <th>EMAIL</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <span className="supplier-code">{supplier.code}</span>
                    </td>
                    <td className="supplier-name">{supplier.name}</td>
                    <td className="text-muted">{supplier.contactPerson}</td>
                    <td className="text-muted">{supplier.phone}</td>
                    <td className="text-muted">{supplier.email}</td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          supplier.status
                        )}`}
                      >
                        {getStatusIcon(supplier.status)}
                        {supplier.statusLabel}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-view"
                          title="Xem chi tiết"
                          onClick={() => handleViewSupplier(supplier.id)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="btn-icon btn-edit"
                          title="Chỉnh sửa"
                          onClick={() => handleEditSupplier(supplier.id)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          title="Xóa"
                          onClick={() => handleDeleteSupplier(supplier)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-data">
                    Không tìm thấy nhà cung cấp nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa nhà cung cấp{" "}
              <strong>{deleteSupplier?.name}</strong>?
            </p>
            <p className="warning-text">Hành động này không thể hoàn tác.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={handleCancelDelete}>
                Hủy
              </button>
              <button
                className="btn-delete-confirm"
                onClick={handleConfirmDelete}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierManagement;
