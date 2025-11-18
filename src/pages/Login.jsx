// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authAPI.login(email, password);
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  function fillDemoStudent() {
    setEmail('student@university.edu');
    setPassword('student123');
  }

  function fillDemoAdmin() {
    setEmail('admin@university.edu');
    setPassword('admin');
  }

  return (
    <div className="page-root">
      <div className="brand">
        <img src="/logo.svg" alt="logo" className="brand-logo" />
        <h1>NextRead</h1>
        <p className="subtitle">Library Booking System</p>
      </div>

      <div className="card">
        <h2 className="card-title">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
            <div className="label">Email</div>
            <div className="input-wrap">
              <span className="icon">👤</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>
          </label>

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      </div>

      <div className="demo-section">
        <div className="demo-card">
          <span className="demo-label">Demo Student</span>
          <span className="demo-text">student@university.edu / student123</span>
          <button type="button" className="demo-btn" onClick={fillDemoStudent}>
            Fill Demo Student
          </button>
        </div>
        <div className="demo-card">
          <span className="demo-label">Demo Admin</span>
          <span className="demo-text">admin@university.edu / admin</span>
          <button type="button" className="demo-btn" onClick={fillDemoAdmin}>
            Fill Demo Admin
          </button>
        </div>
      </div>
    </div>
  );
}