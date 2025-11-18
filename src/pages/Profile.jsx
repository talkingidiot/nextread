// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reservationsAPI } from '../services/api';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [stats, setStats] = useState({
    totalReservations: 0,
    activeReservations: 0,
    booksRead: 0,
  });

  useEffect(() => {
    if (user) {
      setEditForm(user);
      loadUserStats();
    }
  }, [user]);

  async function loadUserStats() {
    try {
      // Load active reservations
      const activeRes = await reservationsAPI.getUserReservations(user.id, 'Active');
      const historyRes = await reservationsAPI.getUserReservations(user.id, 'History');
      const queueRes = await reservationsAPI.getUserReservations(user.id, 'Queue');

      setStats({
        totalReservations: activeRes.length + historyRes.length + queueRes.length,
        activeReservations: activeRes.length,
        booksRead: historyRes.length,
      });
    } catch (err) {
      console.error('Error loading user stats:', err);
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleSave() {
    // TODO: Implement API call to update user profile
    console.log('Save user data:', editForm);
    alert('Profile updated successfully! (Backend update to be implemented)');
    setIsEditing(false);
  }

  function handleCancel() {
    setEditForm(user);
    setIsEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <div className="header-brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
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
          <button className="nav-btn logout-btn" onClick={handleLogout}>
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
                    <button className="member-badge">{user.membershipStatus || 'Active'}</button>
                  </div>
                </div>

                <div className="info-details">
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{user.phone || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Role</span>
                    <span className="info-value">{user.role}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Member Since</span>
                    <span className="info-value">{formatDate(user.joinDate)}</span>
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
                    value={editForm.name || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone || ''}
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
              <span className="summary-value">{stats.totalReservations}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Active Reservations</span>
              <span className="summary-value">{stats.activeReservations}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Books Read</span>
              <span className="summary-value">{stats.booksRead}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Membership Status</span>
              <span className="summary-value status">{user.membershipStatus || 'Active'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}