import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
    });
    setError('');
    setSuccess('');
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
    setSuccess('');

    try {
      await axios.post('http://localhost:5001/api/auth/register', formData);

      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
      });

      setSuccess('Registration successful. Please login.');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError('Server error. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="lost">
            Lost
          </span>

          &nbsp;&

          <span className="found">
            Found
          </span>

          &nbsp;Portal
        </div>

        <h2 className="auth-title">
          Create Account
        </h2>

        <p className="auth-sub">
          Register to report lost or found items
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
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
            autoComplete="new-password"
            tabIndex="-1"
            style={{ display: 'none' }}
          />

          <div className="auth-field">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
              data-lpignore="true"
              required
            />
          </div>

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
            <label>Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
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
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              data-lpignore="true"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <Link to="/login">
            {' '}Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
