import {
  Users,
  Building2,
  BookOpen,
  FileText,
  LayoutDashboard,
  TrendingUp,
  Warehouse,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
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
import dashboardService, { StaffDashboardStats } from "../../api/endpoints/dashboardService";
import { toast } from "react-toastify";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StaffDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data as StaffDashboardStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
      // Set empty stats as fallback
      setStats({
        totalAgencies: 0,
        monthlyExports: 0,
        totalDebt: 0,
        monthlyPayments: 0,
        distributionTrend: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="home"><p>Đang tải...</p></div>;
  }

  if (!stats) {
    return <div className="home"><p>Không thể tải dữ liệu</p></div>;
  }

  // Format distribution trend data for charts
  const revenueVsCostData = stats.distributionTrend.map(item => ({
    month: item.month,
    giaTriPhanPhoi: parseFloat(item.distribution_value?.toString() || '0'),
    giaTriNhapKho: parseFloat(item.import_value?.toString() || '0')
  }));

  // Calculate profit trend
  const profitTrendData = stats.distributionTrend.map(item => ({
    month: item.month,
    loiNhuan: parseFloat(item.distribution_value?.toString() || '0') - parseFloat(item.import_value?.toString() || '0')
  }));

  // Use total debt divided by months for debt trend (simplified)
  const debtByMonthData = stats.distributionTrend.map(() => ({
    month: '',
    congNo: stats.totalDebt / (stats.distributionTrend.length || 1)
  }));

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
      value: stats.totalAgencies.toString(),
      icon: Building2,
      gradient: "blue",
      change: "+" + stats.totalAgencies,
      description: "Đại lý đang hoạt động",
    },
    {
      id: "revenue",
      label: "Giá trị phân phối tháng",
      value: formatCurrency(stats.distributionTrend[stats.distributionTrend.length - 1]?.distribution_value || 0),
      icon: TrendingUp,
      gradient: "green",
      change: formatCurrency(stats.distributionTrend[stats.distributionTrend.length - 1]?.distribution_value || 0),
      description: "Tháng này",
    },
    {
      id: "inventory",
      label: "Tổng công nợ",
      value: formatCurrency(stats.totalDebt),
      icon: Warehouse,
      gradient: "cyan",
      change: formatCurrency(stats.totalDebt),
      description: "Tổng công nợ các đại lý",
    },
    {
      id: "exports",
      label: "Xuất hàng tháng này",
      value: stats.monthlyExports.toString(),
      icon: Package,
      gradient: "red",
      change: "+" + stats.monthlyExports,
      description: "Đơn xuất hàng tháng này",
    },
    {
      id: "profit",
      label: "Thanh toán tháng này",
      value: formatCurrency(stats.monthlyPayments),
      icon: TrendingUp,
      gradient: "purple",
      change: formatCurrency(stats.monthlyPayments),
      description: "Tổng thanh toán tháng này",
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
