import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)

  // Mock user data
  const [user, setUser] = useState({
    name: 'John Doe',
    studentId: '12-3456-789',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    membershipStatus: 'Active Member',
    joinDate: 'January 15, 2023',
  })

  const [editForm, setEditForm] = useState(user)

  function handleEdit() {
    setIsEditing(true)
    setEditForm(user)
  }

  function handleSave() {
    setUser(editForm)
    setIsEditing(false)
  }

  function handleCancel() {
    setIsEditing(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <div className="header-brand">
          <img src="/logo.svg" alt="NextRead" className="header-logo" />
          <span className="header-text">NextRead</span>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/reservations')}>
            My Reservations
          </button>
          <button className="nav-btn" onClick={() => navigate('/home')}>
            Browse Books
          </button>
          <button className="nav-btn">Add</button>
          <button className="nav-btn logout-btn" onClick={() => navigate('/login')}>
            Logout
          </button>
        </nav>
      </header>

      {/* Profile Content */}
      <div className="profile-container">
        <div className="profile-header-section">
          <h1>My Profile</h1>
          <p>View and manage your account information</p>
        </div>

        <div className="profile-grid">
          {/* Personal Information Card */}
          <div className="profile-card personal-info-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              {!isEditing && (
                <button className="edit-btn" onClick={handleEdit}>
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="profile-content">
                <div className="avatar-section">
                  <div className="avatar"></div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="student-id">Student ID: {user.studentId}</p>
                    <button className="member-badge">{user.membershipStatus}</button>
                  </div>
                </div>

                <div className="info-details">
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{user.joinDate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="edit-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-save" onClick={handleSave}>
                    Save Changes
                  </button>
                  <button className="btn-cancel" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Summary Card */}
          <div className="profile-card account-summary-card">
            <h2>Account Summary</h2>
            <div className="summary-item">
              <span className="summary-label">Total Reservations</span>
              <span className="summary-value">7</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Active Reservations</span>
              <span className="summary-value">2</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Books Read</span>
              <span className="summary-value">15</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Membership Status</span>
              <span className="summary-value status">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
