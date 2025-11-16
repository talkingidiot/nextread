import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './BookDetails.css'

export default function BookDetails() {
  const navigate = useNavigate()
  const [reserved, setReserved] = useState(false)

  // Mock book data
  const book = {
    id: 1,
    title: 'Book Title',
    author: 'Author name',
    isbn: '9760-7632-7346-5',
    genre: 'Genre',
    rating: 4.5,
    totalCopies: 5,
    availableCopies: 3,
    inQueue: 2,
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries of Robotic exploration but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset software like Aldus PageMaker including versions of Lorem Ipsum.',
  }

  function handleReserve() {
    setReserved(true)
    // TODO: call API to reserve book
    console.log('Book reserved:', book.id)
  }

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
              <span className="stars">⭐⭐⭐⭐☆</span>
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
              <span className="stat-value">{book.inQueue}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Book Info & Description */}
        <div className="book-info-card">
          <div className="genre-badge">{book.genre}</div>
          <h1 className="book-title">{book.title}</h1>
          <p className="book-author">{book.author}</p>
          <p className="book-isbn">{book.isbn}</p>

          <div className="description-section">
            <h3 className="section-title">Description</h3>
            <p className="description-text">{book.description}</p>
          </div>

          <div className="availability-message">
            <span className="availability-status available">
              This book is available for reservation. Click the button below to reserve your copy
            </span>
          </div>

          <button
            className={`reserve-btn ${reserved ? 'reserved' : ''}`}
            onClick={handleReserve}
            disabled={reserved}
          >
            {reserved ? 'Book Reserved' : 'Reserve Book'}
          </button>
        </div>
      </div>
    </div>
  )
}
