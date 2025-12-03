// src/pages/AdminDashboard.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, usersAPI, reservationsAPI } from '../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeReservations: 0,
    availableBooks: 0,
  });

  useEffect(() => {
    console.log('AdminDashboard mounted, user:', user);
    
    if (!user) {
      console.log('No user, redirecting to login');
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
      setLoading(true);
      console.log('Loading dashboard stats...');
      
      const books = await booksAPI.getAllBooks();
      console.log('Books loaded:', books.length);
      
      const users = await usersAPI.getAllUsers();
      console.log('Users loaded:', users.length);
      
      const reservations = await reservationsAPI.getAllReservations();
      console.log('Reservations loaded:', reservations.length);

      const activeReservations = reservations.filter(r => r.status === 'Active').length;

      setStats({
        totalBooks: books.length,
        totalUsers: users.length,
        activeReservations: activeReservations,
        availableBooks: books.filter(b => b.availableCopies > 0).length,
      });
      
      console.log('Stats loaded successfully');
    } catch (err) {
      console.error('Error loading stats:', err);
      // Set default stats on error
      setStats({
        totalBooks: 0,
        totalUsers: 0,
        activeReservations: 0,
        availableBooks: 0,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  // Show loading while checking user
  if (!user || loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading dashboard...
      </div>
    );
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
          {activeTab === 'users' && <UsersTab onUpdate={loadDashboardStats} />}
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
        <p style={{ color: '#666', fontSize: '14px' }}>
          Activity tracking will be implemented in future updates.
        </p>
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
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }
    
    try {
      await booksAPI.deleteBook(bookId);
      alert('Book deleted successfully!');
      await loadBooks();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book: ' + err.message);
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.genre && book.genre.toLowerCase().includes(searchQuery.toLowerCase()))
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
          placeholder="Search books by title, author, or genre..."
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
            if (onUpdate) onUpdate();
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
            if (onUpdate) onUpdate();
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
                <th>In Queue</th>
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
                    <td>{book.inQueue || 0}</td>
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
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                    {searchQuery ? 'No books found matching your search' : 'No books available. Click "Add New Book" to get started!'}
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
      [name]: name === 'rating' || name === 'totalCopies' || name === 'availableCopies' 
        ? parseFloat(value) || 0 
        : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate form data
      if (!formData.title || !formData.author || !formData.isbn || !formData.genre) {
        alert('Please fill in all required fields');
        setSaving(false);
        return;
      }

      if (formData.availableCopies > formData.totalCopies) {
        alert('Available copies cannot exceed total copies');
        setSaving(false);
        return;
      }

      if (book) {
        await booksAPI.updateBook(book.id, formData);
        alert('Book updated successfully!');
      } else {
        await booksAPI.createBook(formData);
        alert('Book added successfully!');
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
          <button className="close-btn" onClick={onClose}>×</button>
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
              />
            </div>
            <div className="form-group">
              <label>Genre *</label>
              <select 
                name="genre" 
                value={formData.genre} 
                onChange={handleChange} 
                required
                disabled={saving}
              >
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
              disabled={saving}
            />
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onClose} 
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save" 
              disabled={saving}
            >
              {saving ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Users Tab Component
function UsersTab({ onUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = await usersAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
      alert('Error loading users: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await usersAPI.deleteUser(userId);
      alert('User deleted successfully!');
      await loadUsers();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Error deleting user: ' + err.message);
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.studentId && user.studentId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="users-tab">
      <div className="tab-header">
        <h1>Manage Users</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users by name, email, or student ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="books-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.studentId}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`status-badge ${user.membershipStatus === 'Active' ? 'available' : 'unavailable'}`}>
                        {user.membershipStatus}
                      </span>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No users found
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

// Reservations Tab Component
function ReservationsTab() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      setLoading(true);
      const data = await reservationsAPI.getAllReservations();
      setReservations(data);
    } catch (err) {
      console.error('Error loading reservations:', err);
      alert('Error loading reservations: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleReturnBook(reservationId) {
    if (!window.confirm('Mark this book as returned?')) {
      return;
    }
    
    try {
      await reservationsAPI.returnBook(reservationId);
      alert('Book returned successfully!');
      await loadReservations();
    } catch (err) {
      console.error('Error returning book:', err);
      alert('Error returning book: ' + err.message);
    }
  }

  const filteredReservations = filterStatus === 'All' 
    ? reservations 
    : reservations.filter(r => r.status === filterStatus);

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
    <div className="reservations-tab">
      <div className="tab-header">
        <h1>All Reservations</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Active', 'Queue', 'History'].map((status) => (
            <button
              key={status}
              className={`genre-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '6px 12px',
                border: '1px solid #dadce0',
                borderRadius: '6px',
                background: filterStatus === status ? '#0b1220' : '#fff',
                color: filterStatus === status ? '#fff' : '#5f6368',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading reservations...</div>
      ) : (
        <div className="books-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Book</th>
                <th>Reserved Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.user.name}</td>
                    <td>{reservation.book.title}</td>
                    <td>{formatDate(reservation.reservedDate)}</td>
                    <td>{formatDate(reservation.dueDate)}</td>
                    <td>
                      <span className={`status-badge ${
                        reservation.status === 'Active' ? 'available' : 
                        reservation.status === 'Queue' ? 'unavailable' : 
                        'unavailable'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>{reservation.position || '-'}</td>
                    <td>
                      {reservation.status === 'Active' && (
                        <button 
                          className="btn-edit" 
                          onClick={() => handleReturnBook(reservation.id)}
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No reservations found
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