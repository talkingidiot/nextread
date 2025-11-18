// src/services/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function to handle API responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  return response.json();
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },
};

// Books API
export const booksAPI = {
  getAllBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books`);
    return handleResponse(response);
  },

  getBookById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    return handleResponse(response);
  },

  createBook: async (book) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    return handleResponse(response);
  },

  updateBook: async (id, book) => {
    console.log('Updating book:', id, book);
    
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update book error:', error);
      throw error;
    }
  },

  deleteBook: async (id) => {
    console.log('Deleting book:', id);
    
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete book');
      }
      
      return response.text();
    } catch (error) {
      console.error('Delete book error:', error);
      throw error;
    }
  },
};

// Reservations API
export const reservationsAPI = {
  getUserReservations: async (userId, status) => {
    const response = await fetch(
      `${API_BASE_URL}/reservations/user/${userId}?status=${status}`
    );
    return handleResponse(response);
  },

  reserveBook: async (userId, bookId) => {
    const response = await fetch(`${API_BASE_URL}/reservations/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, bookId }),
    });
    return handleResponse(response);
  },

  cancelReservation: async (reservationId) => {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to cancel reservation');
    }
    return response.text();
  },
};