import React, { useState } from 'react';
import './Register.css';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    // TODO: Call API register
    console.log('Register:', formData);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Logo */}
        <div className="register-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>

        {/* Title */}
        <h1 className="register-title">Đăng ký</h1>
        <p className="register-subtitle">Tạo tài khoản mới để sử dụng hệ thống</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Username Field */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Nhập email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-input"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Submit Button */}
          <button type="submit" className="register-button">
            Đăng ký
          </button>

          {/* Footer Links */}
          <div className="register-footer">
            <span className="footer-text">Đã có tài khoản?</span>
            <a href="/login" className="footer-link">
              Đăng nhập ngay
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;