import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();

    setFormData({
      email: '',
      password: '',
    });
    setError('');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setFormData({
        email: '',
        password: '',
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed! Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="lost">LOST</span>
          &nbsp;&
          <span className="found">FOUND</span>
          &nbsp;PORTAL
        </div>

        <h2 className="auth-title">
          Welcome Back
        </h2>

        <p className="auth-sub">
          Login to report lost or found items
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="fake_username"
            autoComplete="username"
            tabIndex="-1"
            style={{ display: 'none' }}
          />

          <input
            type="password"
            name="fake_password"
            autoComplete="current-password"
            tabIndex="-1"
            style={{ display: 'none' }}
          />

          <div className="auth-field">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              data-lpignore="true"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              data-lpignore="true"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?
          <Link to="/register">
            {' '}Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
