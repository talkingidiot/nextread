import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MyReservations.css'

export default function MyReservations() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Active')

  // Mock reservation data
  const reservations = {
    Active: [
      {
        id: 1,
        title: 'Book Title',
        author: 'Book Author',
        reservedDate: '11/10/2025',
        status: 'Currently Borrowed',
        dueDate: '11/25/2025',
        image: '/book-1.svg',
      },
      {
        id: 2,
        title: 'Book Title',
        author: 'Book Author',
        reservedDate: '11/10/2025',
        status: 'Please pick up within 48 hours',
        dueDate: '11/18/2025',
        image: '/book-2.svg',
      },
    ],
    Queue: [
      {
        id: 3,
        title: 'Book Title',
        author: 'Book Author',
        reservedDate: '11/10/2025',
        status: 'In Queue',
        position: 2,
        estimatedWait: '28 Days',
        peopleAhead: 2,
        image: '/book-3.svg',
      },
    ],
    History: [
      {
        id: 4,
        title: 'Book Title',
        author: 'Book Author',
        returnedDate: '11/05/2025',
        status: 'Returned',
        image: '/book-4.svg',
      },
      {
        id: 5,
        title: 'Book Title',
        author: 'Book Author',
        returnedDate: '10/30/2025',
        status: 'Returned',
        image: '/book-5.svg',
      },
    ],
  }

  const currentReservations = reservations[activeTab] || []

  function getTabCount(tab) {
    return reservations[tab]?.length || 0
  }

  function handleRenew(id) {
    console.log('Renew reservation:', id)
    alert('Renewal request submitted!')
  }

  function handleCancel(id) {
    console.log('Cancel reservation:', id)
    alert('Reservation cancelled!')
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
          <button className="nav-btn">Browse Books</button>
          <button className="nav-btn" onClick={() => navigate('/profile')}>
            Add
          </button>
          <button className="nav-btn logout-btn" onClick={() => navigate('/login')}>
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
          {currentReservations.length > 0 ? (
            currentReservations.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-image"></div>
                <div className="reservation-info">
                  <h3 className="book-title">{reservation.title}</h3>
                  <p className="book-author">{reservation.author}</p>

                  {activeTab === 'Active' && (
                    <>
                      <div className="reservation-detail">
                        <span className="detail-label">Reserved on:</span>
                        <span className="detail-value">{reservation.reservedDate}</span>
                      </div>
                      <div className="status-row">
                        <span className={`status-badge ${reservation.status === 'Currently Borrowed' ? 'borrowed' : 'pending'}`}>
                          {reservation.status}
                        </span>
                      </div>
                    </>
                  )}

                  {activeTab === 'Queue' && (
                    <>
                      <div className="reservation-detail">
                        <span className="detail-label">Reserved on:</span>
                        <span className="detail-value">{reservation.reservedDate}</span>
                      </div>
                      <div className="queue-info">
                        <div className="queue-wait">
                          <span className="queue-label">Estimated Wait:</span>
                          <span className="queue-value">{reservation.estimatedWait}</span>
                        </div>
                        <div className="queue-position">
                          <span className="position-icon">👥</span>
                          <span className="position-text">{reservation.peopleAhead} people ahead of you</span>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'History' && (
                    <>
                      <div className="reservation-detail">
                        <span className="detail-label">Returned on:</span>
                        <span className="detail-value">{reservation.returnedDate}</span>
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
  )
}
