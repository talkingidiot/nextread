// src/pages/MyReservations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reservationsAPI } from '../services/api';
import './MyReservations.css';

export default function MyReservations() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Active');
  const [reservations, setReservations] = useState({
    Active: [],
    Queue: [],
    History: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadReservations();
    }
  }, [user, activeTab]);

  async function loadReservations() {
    try {
      setLoading(true);
      const data = await reservationsAPI.getUserReservations(user.id, activeTab);
      setReservations((prev) => ({
        ...prev,
        [activeTab]: data,
      }));
    } catch (err) {
      setError('Failed to load reservations');
      console.error('Error loading reservations:', err);
    } finally {
      setLoading(false);
    }
  }

  function getTabCount(tab) {
    return reservations[tab]?.length || 0;
  }

  async function handleCancel(id) {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationsAPI.cancelReservation(id);
      alert('Reservation cancelled successfully!');
      loadReservations(); // Reload to reflect changes
    } catch (err) {
      alert('Failed to cancel reservation: ' + err.message);
    }
  }

  function handleRenew(id) {
    // TODO: Implement renew functionality in backend
    console.log('Renew reservation:', id);
    alert('Renewal request submitted! (Feature to be implemented)');
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const currentReservations = reservations[activeTab] || [];

  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  }

  return (
    <div className="reservations-page">
      {/* Header */}
      <header className="reservations-header">
        <div className="header-brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <img src="/logo.svg" alt="NextRead" className="header-logo" />
          <span className="header-text">NextRead</span>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/home')}>
            Browse Books
          </button>
          <button className="nav-btn" onClick={() => navigate('/profile')}>
            Profile
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      {/* Reservations Content */}
      <div className="reservations-container">
        <div className="reservations-header-section">
          <h1>My Reservations</h1>
          <p>Manage your book reservations and queue positions</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Tabs */}
        <div className="tabs-section">
          <div className="tabs">
            {['Active', 'Queue', 'History'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab} ({getTabCount(tab)})
              </button>
            ))}
          </div>
        </div>

        {/* Reservations List */}
        <div className="reservations-list">
          {loading ? (
            <div className="loading">Loading reservations...</div>
          ) : currentReservations.length > 0 ? (
            currentReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-image"></div>
                <div className="reservation-info">
                  <h3 className="book-title">{reservation.book.title}</h3>
                  <p className="book-author">{reservation.book.author}</p>

                  {activeTab === 'Active' && (
                    <>
                      <div className="reservation-detail">
                        <span className="detail-label">Reserved on:</span>
                        <span className="detail-value">{formatDate(reservation.reservedDate)}</span>
                      </div>
                      {reservation.dueDate && (
                        <div className="reservation-detail">
                          <span className="detail-label">Due Date:</span>
                          <span className="detail-value">{formatDate(reservation.dueDate)}</span>
                        </div>
                      )}
                      <div className="status-row">
                        <span className="status-badge borrowed">{reservation.status}</span>
                      </div>
                    </>
                  )}

                  {activeTab === 'Queue' && (
                    <>
                      <div className="reservation-detail">
                        <span className="detail-label">Reserved on:</span>
                        <span className="detail-value">{formatDate(reservation.reservedDate)}</span>
                      </div>
                      <div className="queue-info">
                        {reservation.estimatedWait && (
                          <div className="queue-wait">
                            <span className="queue-label">Estimated Wait:</span>
                            <span className="queue-value">{reservation.estimatedWait}</span>
                          </div>
                        )}
                        {reservation.position && (
                          <div className="queue-position">
                            <span className="position-icon">👥</span>
                            <span className="position-text">Position {reservation.position} in queue</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === 'History' && (
                    <>
                      <div className="reservation-detail">
                        <span className="detail-label">Returned on:</span>
                        <span className="detail-value">{formatDate(reservation.reservedDate)}</span>
                      </div>
                      <div className="status-row">
                        <span className="status-badge returned">{reservation.status}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="reservation-actions">
                  {activeTab === 'Active' && (
                    <>
                      <button className="action-btn renew-btn" onClick={() => handleRenew(reservation.id)}>
                        Renew
                      </button>
                      <button className="action-btn cancel-btn" onClick={() => handleCancel(reservation.id)}>
                        Cancel
                      </button>
                    </>
                  )}
                  {activeTab === 'Queue' && (
                    <button className="action-btn cancel-btn" onClick={() => handleCancel(reservation.id)}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No {activeTab.toLowerCase()} reservations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}