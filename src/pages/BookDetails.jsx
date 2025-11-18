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

  useEffect(() => {
    loadBook();
  }, [id]);

  async function loadBook() {
    try {
      setLoading(true);
      const data = await booksAPI.getBookById(id);
      setBook(data);
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

    try {
      setReserving(true);
      setError('');
      await reservationsAPI.reserveBook(user.id, book.id);
      setReserved(true);
      
      // Refresh book data to update available copies
      await loadBook();
    } catch (err) {
      setError(err.message || 'Failed to reserve book');
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
        <button className="back-btn" onClick={() => navigate('/home')}>
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
          </div>
        </div>

        {/* Right Side - Book Info & Description */}
        <div className="book-info-card">
          <div className="genre-badge">{book.genre}</div>
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">{book.author}</p>
          <p className="book-isbn">ISBN: {book.isbn}</p>

          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="description-text">{book.description}</p>
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
              Book successfully reserved! Check your reservations page.
            </div>
          )}

          <div className="availability-message">
            <span className={`availability-status ${isAvailable ? 'available' : 'unavailable'}`}>
              {isAvailable
                ? 'This book is available for reservation. Click the button below to reserve your copy'
                : 'This book is currently unavailable. You can join the queue.'}
            </span>
          </div>

          <button
            className={`reserve-btn ${reserved ? 'reserved' : ''}`}
            onClick={handleReserve}
            disabled={reserved || reserving}
          >
            {reserving ? 'Reserving...' : reserved ? 'Book Reserved' : 'Reserve Book'}
          </button>
        </div>
      </div>
    </div>
  );
}