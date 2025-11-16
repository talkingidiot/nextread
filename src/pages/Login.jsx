import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: wire to auth API
    console.log('login', { username, password })
    // Navigate to home on successful login
    navigate('/home')
  }

  function fillDemoStudent() {
    setUsername('student')
    setPassword('student123')
  }

  function fillDemoAdmin() {
    setUsername('admin')
    setPassword('admin')
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
          <label className="field">
            <div className="label">Username</div>
            <div className="input-wrap">
              <span className="icon">👤</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
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
              />
            </div>
          </label>

          <button className="btn-login" type="submit">Login</button>

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      </div>

      <div className="demo-section">
        <div className="demo-card">
          <span className="demo-label">Demo Student</span>
          <span className="demo-text">Enter any username and password</span>
          <button type="button" className="demo-btn" onClick={fillDemoStudent}>
            Fill Demo Student
          </button>
        </div>
        <div className="demo-card">
          <span className="demo-label">Demo Admin</span>
          <span className="demo-text">Username: admin, any password</span>
          <button type="button" className="demo-btn" onClick={fillDemoAdmin}>
            Fill Demo Admin
          </button>
        </div>
      </div>
    </div>
  )
}
