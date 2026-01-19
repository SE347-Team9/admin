import {
  Users,
  Building2,
  BookOpen,
  FileText,
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  Warehouse,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
} from "recharts";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  // Mock data cho biểu đồ - Giá trị phân phối vs Giá trị nhập kho (6 tháng gần nhất)
  const revenueVsCostData = [
    { month: "T1", giaTriPhanPhoi: 850000000, giaTriNhapKho: 680000000 },
    { month: "T2", giaTriPhanPhoi: 920000000, giaTriNhapKho: 720000000 },
    { month: "T3", giaTriPhanPhoi: 780000000, giaTriNhapKho: 650000000 },
    { month: "T4", giaTriPhanPhoi: 1050000000, giaTriNhapKho: 820000000 },
    { month: "T5", giaTriPhanPhoi: 980000000, giaTriNhapKho: 780000000 },
    { month: "T6", giaTriPhanPhoi: 1150000000, giaTriNhapKho: 890000000 },
  ];

  // Mock data cho biểu đồ lợi nhuận theo tháng
  const profitTrendData = [
    { month: "T1", loiNhuan: 170000000 },
    { month: "T2", loiNhuan: 200000000 },
    { month: "T3", loiNhuan: 130000000 },
    { month: "T4", loiNhuan: 230000000 },
    { month: "T5", loiNhuan: 200000000 },
    { month: "T6", loiNhuan: 260000000 },
  ];

  // Mock data cho biểu đồ tổng công nợ đại lý theo tháng
  const debtByMonthData = [
    { month: "T1", congNo: 280000000 },
    { month: "T2", congNo: 320000000 },
    { month: "T3", congNo: 295000000 },
    { month: "T4", congNo: 350000000 },
    { month: "T5", congNo: 340000000 },
    { month: "T6", congNo: 325000000 },
  ];

  // Format số tiền VND
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)} tỷ`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)} tr`;
    }
    return value.toLocaleString("vi-VN");
  };

  // Custom tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Tháng ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString("vi-VN")} VNĐ`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const statistics = [
    {
      id: "agencies",
      label: "Tổng đại lý",
      value: "156",
      icon: Building2,
      gradient: "blue",
      change: "+8.2%",
      description: "Đại lý đang hoạt động",
    },
    {
      id: "revenue",
      label: "Giá trị phân phối tháng",
      value: "1.15 tỷ",
      icon: TrendingUp,
      gradient: "green",
      change: "+17.3%",
      description: "So với tháng trước",
    },
    {
      id: "inventory",
      label: "Giá trị tồn kho",
      value: "2.8 tỷ",
      icon: Warehouse,
      gradient: "cyan",
      change: "+5.1%",
      description: "Tổng giá trị hàng trong kho",
    },
    {
      id: "lowstock",
      label: "Sản phẩm cần nhập",
      value: "12",
      icon: Package,
      gradient: "red",
      change: "+3",
      description: "SP sắp hết/hết hàng",
    },
    {
      id: "profit",
      label: "Lợi nhuận tháng",
      value: "260 tr",
      icon: TrendingUp,
      gradient: "purple",
      change: "+30%",
      description: "So với tháng trước",
    },
    {
      id: "debt",
      label: "Tổng công nợ",
      value: "325 tr",
      icon: AlertTriangle,
      gradient: "orange",
      change: "-3.2%",
      description: "Giảm so với tháng trước",
    },
  ];

  const adminModules = [
    {
      id: "account",
      icon: Users,
      title: "Quản lý tài khoản",
      description: "Quản lý tài khoản người dùng trong hệ thống",
      path: "/account-management",
      color: "blue",
    },
    {
      id: "agency",
      icon: Building2,
      title: "Quản lý đại lý",
      description: "Quản lý thông tin các đại lý trong hệ thống",
      path: "/agency-management",
      color: "green",
    },
    {
      id: "regulations",
      icon: BookOpen,
      title: "Quy định",
      description: "Quản lý các quy định và chính sách của hệ thống",
      path: "/regulations",
      color: "purple",
    },
    {
      id: "reports",
      icon: FileText,
      title: "Báo cáo",
      description: "Xem và quản lý các báo cáo trong hệ thống",
      path: "/reports",
      color: "orange",
    },
  ];

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-icon-box">
            <LayoutDashboard size={32} />
          </div>
          <div className="header-text">
            <h1 className="page-title">Bảng điều khiển quản trị</h1>
            <p className="page-subtitle">
              Tổng quan hoạt động kinh doanh hệ thống đại lý
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-section">
          <div className="stats-grid">
            {statistics.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`stat-card gradient-${stat.gradient}`}
                >
                  <div className="stat-content">
                    <div className="stat-header">
                      <span className="stat-label">{stat.label}</span>
                      <span
                        className={`stat-change ${
                          stat.change.startsWith("-") ? "negative" : ""
                        }`}
                      >
                        <TrendingUp size={14} />
                        {stat.change}
                      </span>
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-description">{stat.description}</div>
                  </div>
                  <div className="stat-icon">
                    <Icon size={48} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Row 1: Combined Chart - Giá trị phân phối vs Giá trị nhập kho */}
          <div className="chart-card chart-full-width">
            <div className="chart-header">
              <h3 className="chart-title">
                Giá trị phân phối vs Giá trị nhập kho
              </h3>
              <span className="chart-subtitle">
                6 tháng gần nhất - So sánh giá trị hàng xuất/nhập kho
              </span>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                  data={revenueVsCostData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="giaTriNhapKho"
                    name="Giá trị nhập kho"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="giaTriPhanPhoi"
                    name="Giá trị phân phối"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Line Charts - Lợi nhuận và Công nợ */}
          <div className="charts-row">
            {/* Biểu đồ xu hướng lợi nhuận */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Xu hướng lợi nhuận</h3>
                <span className="chart-subtitle">
                  6 tháng gần nhất - Lợi nhuận theo tháng
                </span>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={profitTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={formatCurrency}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="loiNhuan"
                      name="Lợi nhuận"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: "#22c55e", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ tổng công nợ đại lý theo tháng */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Tổng công nợ đại lý theo tháng</h3>
                <span className="chart-subtitle">
                  6 tháng gần nhất - Theo dõi công nợ cần thu hồi
                </span>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart
                    data={debtByMonthData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={formatCurrency}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="congNo"
                      name="Công nợ"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Main Modules Section */}
        <div className="modules-section">
          <div className="section-title">
            <h2>Các chức năng chính</h2>
            <p>Truy cập nhanh vào các module quản lý</p>
          </div>
          <div className="modules-grid">
            {adminModules.map((module) => {
              const Icon = module.icon;
              return (
                <button
                  key={module.id}
                  className={`module-card color-${module.color}`}
                  onClick={() => navigate(module.path)}
                >
                  <div className="module-icon-wrapper">
                    <div className="module-icon">
                      <Icon size={32} />
                    </div>
                  </div>
                  <div className="module-content">
                    <h3 className="module-title">{module.title}</h3>
                    <p className="module-description">{module.description}</p>
                  </div>
                  <div className="module-arrow">→</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
