import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    console.log('Login:', { username, password });
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

          <button type="submit" className="login-button">
            Đăng nhập
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