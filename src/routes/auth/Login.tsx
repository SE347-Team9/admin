import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/endpoints/authService';
import socketService from '../../services/socketService';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.login(username, password);
      
      if (response.success) {
        // Initialize socket connection
        const user = authService.getCurrentUser();
        if (user) {
          socketService.connect(user.id, user.role);
          
          // Redirect based on role
          switch (user.role) {
            case 'admin':
              navigate('/admin/home');
              break;
            case 'staff':
              navigate('/staff/home');
              break;
            case 'agency':
              navigate('/agency/dashboard');
              break;
            default:
              navigate('/');
          }
        }
      } else {
        setError(response.message || 'Đăng nhập thất bại');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path 
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
              stroke="#3b82f6" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path 
              d="M9 22V12h6v10" 
              stroke="#3b82f6" 
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="login-title">Đăng nhập</h1>
        <p className="login-subtitle">Chào mừng bạn quay lại hệ thống!</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form__group">
            <label htmlFor="username" className="login-form__label">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              className="login-form__input"
              placeholder="Nhập tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="login-form__group">
            <label htmlFor="password" className="login-form__label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="login-form__input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <div className="login-footer">
            <a href="/register" className="footer-link">
              Chưa có tài khoản?
            </a>
            <a href="/forgot-password" className="footer-link">
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;