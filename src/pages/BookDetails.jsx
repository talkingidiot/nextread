// src/pages/BookDetails.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, reservationsAPI } from '../services/api';
import './BookDetails.css';

export default function BookDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [error, setError] = useState('');
  const [borrowDays, setBorrowDays] = useState(14);
  const [showBorrowOptions, setShowBorrowOptions] = useState(false);

  useEffect(() => {
    loadBook();
  }, [id]);

  async function loadBook() {
    try {
      setLoading(true);
      const data = await booksAPI.getBookById(id);
      setBook(data);
      
      // Check if user already has this book reserved
      if (user) {
        const [activeRes, queueRes] = await Promise.all([
          reservationsAPI.getUserReservations(user.id, 'Active'),
          reservationsAPI.getUserReservations(user.id, 'Queue')
        ]);
        
        const hasReservation = [...activeRes, ...queueRes].some(
          res => res.book.id === parseInt(id)
        );
        
        if (hasReservation) {
          setReserved(true);
        }
      }
    } catch (err) {
      setError('Failed to load book details');
      console.error('Error loading book:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve() {
    if (!user) {
      navigate('/login');
      return;
    }

    setShowBorrowOptions(false);
    setReserving(true);
    setError('');

    try {
      await reservationsAPI.reserveBook(user.id, book.id, borrowDays);
      setReserved(true);
      
      // Refresh book data to update available copies
      await loadBook();
      
      // Show success message based on availability
      if (book.availableCopies > 0) {
        alert(`Book successfully reserved for ${borrowDays} days! Check your reservations page.`);
      } else {
        alert('You have been added to the queue. You will be notified when the book becomes available.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reserve book');
      setReserved(false);
    } finally {
      setReserving(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (!book) {
    return <div className="error">Book not found</div>;
  }

  const isAvailable = book.availableCopies > 0;
  const stars = '⭐'.repeat(Math.floor(book.rating)) + '☆'.repeat(5 - Math.floor(book.rating));

  return (
    <div className="book-details-page">
      {/* Back Button */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(user?.role === 'ADMIN' ? '/admin' : '/home')}>
          ← Back to Browse
        </button>
      </div>

      <div className="details-container">
        {/* Left Side - Book Image & Stats */}
        <div className="book-image-card">
          <div className="book-image-large"></div>
          <div className="book-stats">
            <div className="rating">
              <span className="stars">{stars}</span>
              <span className="rating-value">{book.rating}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total Copies</span>
              <span className="stat-value">{book.totalCopies}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Available</span>
              <span className="stat-value">{book.availableCopies}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">In Queue</span>
              <span className="stat-value">{book.inQueue || 0}</span>
            </div>
            {!isAvailable && book.inQueue > 0 && (
              <div className="stat-row">
                <span className="stat-label">Est. Wait</span>
                <span className="stat-value">{book.inQueue * 14} Days</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Book Info & Description */}
        <div className="book-info-card">
          <div className="genre-badge">{book.genre}</div>
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">by {book.author}</p>
          <p className="book-isbn">ISBN: {book.isbn}</p>

          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="description-text">
              {book.description || 'No description available for this book.'}
            </p>
          </div>

          {error && (
            <div className="error-message" style={{ 
              color: 'red', 
              padding: '0.5rem', 
              marginBottom: '1rem',
              backgroundColor: '#fee',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          {reserved && (
            <div className="success-message" style={{ 
              color: 'green', 
              padding: '0.5rem', 
              marginBottom: '1rem',
              backgroundColor: '#efe',
              borderRadius: '4px'
            }}>
              {isAvailable ? 
                'Book successfully reserved! Check your reservations page.' : 
                'You are in the queue for this book. You will be notified when it becomes available.'}
            </div>
          )}

          <div className="availability-message">
            <span className={`availability-status ${isAvailable ? 'available' : 'unavailable'}`}>
              {isAvailable
                ? `${book.availableCopies} ${book.availableCopies === 1 ? 'copy' : 'copies'} available for reservation`
                : `Currently unavailable. ${book.inQueue || 0} ${book.inQueue === 1 ? 'person' : 'people'} in queue`}
            </span>
          </div>

          {/* Borrow Duration Options */}
          {showBorrowOptions && !reserved && (
            <div className="borrow-options" style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                fontSize: '14px' 
              }}>
                How long do you need the book?
              </label>
              <select 
                value={borrowDays} 
                onChange={(e) => setBorrowDays(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              >
                <option value={7}>1 Week (7 days)</option>
                <option value={14}>2 Weeks (14 days)</option>
                <option value={21}>3 Weeks (21 days)</option>
                <option value={30}>1 Month (30 days)</option>
              </select>
              <div style={{ 
                marginTop: '0.5rem', 
                fontSize: '12px', 
                color: '#666' 
              }}>
                You can extend the borrowing period later if needed.
              </div>
            </div>
          )}

          {/* Reserve Button */}
          {user?.role !== 'ADMIN' && (
            <button
              className={`reserve-btn ${reserved ? 'reserved' : ''}`}
              onClick={() => {
                if (!showBorrowOptions && !reserved) {
                  setShowBorrowOptions(true);
                } else if (showBorrowOptions) {
                  handleReserve();
                }
              }}
              disabled={reserved || reserving}
            >
              {reserving ? 'Reserving...' : 
               reserved ? (isAvailable ? 'Book Reserved' : 'In Queue') : 
               showBorrowOptions ? 'Confirm Reservation' :
               (isAvailable ? 'Reserve Book' : 'Join Queue')}
            </button>
          )}

          {showBorrowOptions && !reserved && (
            <button
              onClick={() => setShowBorrowOptions(false)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#f1f3f4',
                color: '#5f6368',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '8px'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}