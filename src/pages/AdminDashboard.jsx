// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeReservations: 0,
    availableBooks: 0,
  });

  // Add logging to debug
  console.log('AdminDashboard - Current user:', user);
  console.log('AdminDashboard - User role:', user?.role);

  useEffect(() => {
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      console.log('User is not admin, redirecting to home');
      navigate('/home');
      return;
    }

    loadDashboardStats();
  }, [user, navigate]);

  async function loadDashboardStats() {
    try {
      const books = await booksAPI.getAllBooks();
      setStats({
        totalBooks: books.length,
        totalUsers: 0,
        activeReservations: 0,
        availableBooks: books.filter(b => b.availableCopies > 0).length,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Don't render until user is loaded
  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  // Don't render if not admin
  if (user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-brand">
          <img src="/logo.svg" alt="NextRead" className="header-logo" />
          <span className="header-text">NextRead Admin</span>
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

      {/* Main Content */}
      <div className="admin-container">
        <div className="admin-sidebar">
          <button
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            📚 Manage Books
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Manage Users
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            📋 All Reservations
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'books' && <BooksTab onUpdate={loadDashboardStats} />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'reservations' && <ReservationsTab />}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats }) {
  return (
    <div className="overview-tab">
      <h1>Dashboard Overview</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Total Books</h3>
            <p className="stat-value">{stats.totalBooks}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Available Books</h3>
            <p className="stat-value">{stats.availableBooks}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Active Reservations</h3>
            <p className="stat-value">{stats.activeReservations}</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-time">2 hours ago</span>
            <span className="activity-text">New book added: "The Great Gatsby"</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">5 hours ago</span>
            <span className="activity-text">User reserved: "To Kill a Mockingbird"</span>
          </div>
          <div className="activity-item">
            <span className="activity-time">1 day ago</span>
            <span className="activity-text">Book returned: "1984"</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Books Tab Component
function BooksTab({ onUpdate }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      setLoading(true);
      const data = await booksAPI.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error('Error loading books:', err);
      alert('Error loading books: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBook(bookId) {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    
    try {
      // Check if deleteBook method exists
      if (typeof booksAPI.deleteBook !== 'function') {
        alert('Delete function not available. Please check your API configuration.');
        return;
      }
      
      await booksAPI.deleteBook(bookId);
      await loadBooks();
      onUpdate();
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book: ' + err.message);
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="books-tab">
      <div className="tab-header">
        <h1>Manage Books</h1>
        <button className="btn-primary" onClick={() => setShowAddForm(true)}>
          + Add New Book
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {showAddForm && (
        <BookForm
          onClose={() => setShowAddForm(false)}
          onSave={() => {
            loadBooks();
            onUpdate();
            setShowAddForm(false);
          }}
        />
      )}

      {editingBook && (
        <BookForm
          book={editingBook}
          onClose={() => setEditingBook(null)}
          onSave={() => {
            loadBooks();
            onUpdate();
            setEditingBook(null);
          }}
        />
      )}

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <div className="books-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Total Copies</th>
                <th>Available</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.totalCopies}</td>
                    <td>{book.availableCopies}</td>
                    <td>
                      <span className={`status-badge ${book.status === 'Available' ? 'available' : 'unavailable'}`}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-edit" onClick={() => setEditingBook(book)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => handleDeleteBook(book.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Book Form Component
function BookForm({ book, onClose, onSave }) {
  const [formData, setFormData] = useState(
    book || {
      title: '',
      author: '',
      isbn: '',
      genre: '',
      rating: 0,
      totalCopies: 1,
      availableCopies: 1,
      inQueue: 0,
      description: '',
      status: 'Available',
    }
  );
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (book) {
        // Check if updateBook exists
        if (typeof booksAPI.updateBook !== 'function') {
          alert('Update function not available. Please check your API configuration.');
          return;
        }
        await booksAPI.updateBook(book.id, formData);
      } else {
        await booksAPI.createBook(formData);
      }
      onSave();
    } catch (err) {
      console.error('Error saving book:', err);
      alert('Error saving book: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Genre *</label>
              <select name="genre" value={formData.genre} onChange={handleChange} required>
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Mystery">Mystery</option>
                <option value="Science">Science</option>
                <option value="Romance">Romance</option>
                <option value="History">History</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Total Copies *</label>
              <input
                type="number"
                name="totalCopies"
                min="1"
                value={formData.totalCopies}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Available Copies *</label>
              <input
                type="number"
                name="availableCopies"
                min="0"
                value={formData.availableCopies}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab() {
  return (
    <div className="users-tab">
      <h1>Manage Users</h1>
      <p>User management features coming soon...</p>
    </div>
  );
}

// Reservations Tab Component
function ReservationsTab() {
  return (
    <div className="reservations-tab">
      <h1>All Reservations</h1>
      <p>Reservation management features coming soon...</p>
    </div>
  );
}