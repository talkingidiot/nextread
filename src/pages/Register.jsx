import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.studentId.trim()) {
      setError('Student ID is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    setLoading(true);

    try {
      const user = await authAPI.register(
        formData.name,
        formData.email,
        formData.password,
        formData.studentId,
        formData.phone
      );
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-root">
      <div className="brand">
        <img src="/logo.svg" alt="logo" className="brand-logo" />
        <h1>NextRead</h1>
        <p className="subtitle">Library Booking System</p>
      </div>

      <div className="card">
        <h2 className="card-title">Create Your Account</h2>
        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div style={{
              color: 'red',
              marginBottom: '1rem',
              padding: '0.5rem',
              backgroundColor: '#fee',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          <label className="field">
            <div className="label">Full Name</div>
            <div className="input-wrap">
              <span className="icon">👤</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label className="field">
            <div className="label">Email</div>
            <div className="input-wrap">
              <span className="icon">✉️</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label className="field">
            <div className="label">Student ID</div>
            <div className="input-wrap">
              <span className="icon">🎓</span>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter your student ID"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label className="field">
            <div className="label">Phone Number</div>
            <div className="input-wrap">
              <span className="icon">📱</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label className="field">
            <div className="label">Password</div>
            <div className="input-wrap">
              <span className="icon">🔒</span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password (min 6 characters)"
                required
                disabled={loading}
              />
            </div>
          </label>

          <label className="field">
            <div className="label">Confirm Password</div>
            <div className="input-wrap">
              <span className="icon">🔒</span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>
          </label>

          <button className="btn-register" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <div className="login-link">
            <span>Already have an account? </span>
            <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
