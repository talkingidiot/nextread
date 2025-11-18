// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../services/api';
import './HomePage.css';

const genres = ['All', 'Fiction', 'Fantasy', 'Mystery', 'Science', 'Romance', 'History'];

export default function HomePage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirect admin to admin dashboard
    if (user?.role === 'ADMIN') {
      navigate('/admin');
      return;
    }
    
    window.scrollTo(0, 0);
    loadBooks();
  }, [user, navigate]);

  async function loadBooks() {
    try {
      setLoading(true);
      const data = await booksAPI.getAllBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  }

  function handlePrevCarousel() {
    setCarouselIndex((prev) => Math.max(prev - 1, 0));
  }

  function handleNextCarousel() {
    const maxIndex = Math.max(0, books.length - 4);
    setCarouselIndex((prev) => Math.min(prev + 1, maxIndex));
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Filter books based on search query and genre
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="header-brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <img src="/logo.svg" alt="NextRead" className="header-logo" />
          <span className="header-text">NextRead</span>
        </div>
        <nav className="header-nav">
          <button className="nav-btn" onClick={() => navigate('/reservations')}>
            My Reservations
          </button>
          <button className="nav-btn" onClick={() => navigate('/profile')}>
            Profile
          </button>
          {user?.role === 'ADMIN' && (
            <button className="nav-btn" onClick={() => navigate('/add-book')}>
              Add Book
            </button>
          )}
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search books by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Popular Books Section */}
      <section className="popular-section">
        <div className="section-header">
          <h2>Popular Books</h2>
          <div className="carousel-controls">
            <button className="arrow-btn" onClick={handlePrevCarousel}>
              ‹
            </button>
            <button className="arrow-btn" onClick={handleNextCarousel}>
              ›
            </button>
          </div>
        </div>

        <div className="carousel-wrapper">
          <div className="carousel" style={{ transform: `translateX(-${carouselIndex * 25}%)` }}>
            {books.slice(0, 8).map((book) => (
              <div key={book.id} className="book-card" onClick={() => navigate(`/book/${book.id}`)}>
                <div className="book-image"></div>
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <div className="book-footer">
                  <span className={`status-badge ${book.status === 'Available' ? 'available' : 'out-of-stock'}`}>
                    {book.status}
                  </span>
                  <span className="book-rating">⭐ {book.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genre Filter */}
      <section className="genre-section">
        <h3 className="genre-title">Browse by Genre</h3>
        <div className="genre-tabs">
          {genres.map((genre) => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* All Books Section */}
      <section className="all-books-section">
        <h3 className="all-books-title">All Books</h3>
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card book-card-grid" onClick={() => navigate(`/book/${book.id}`)}>
              <div className="book-image"></div>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              <span className="book-rating">⭐ {book.rating}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}