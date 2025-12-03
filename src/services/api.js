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

  register: async (name, email, password, studentId, phone) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, studentId, phone }),
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

  getBooksByGenre: async (genre) => {
    const response = await fetch(`${API_BASE_URL}/books?genre=${genre}`);
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
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });
    return handleResponse(response);
  },

  deleteBook: async (id) => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
    
    return response.text();
  },
};

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return handleResponse(response);
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return handleResponse(response);
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    
    return response.text();
  },
};

// Reservations API
export const reservationsAPI = {
  getAllReservations: async () => {
    const response = await fetch(`${API_BASE_URL}/reservations`);
    return handleResponse(response);
  },

  getUserReservations: async (userId, status) => {
    const response = await fetch(
      `${API_BASE_URL}/reservations/user/${userId}?status=${status}`
    );
    return handleResponse(response);
  },

  reserveBook: async (userId, bookId, borrowDays = 14) => {
    const response = await fetch(`${API_BASE_URL}/reservations/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, bookId, borrowDays }),
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

  returnBook: async (reservationId) => {
    const response = await fetch(
      `${API_BASE_URL}/reservations/${reservationId}/return`,
      {
        method: 'PUT',
      }
    );
    if (!response.ok) {
      throw new Error('Failed to return book');
    }
    return response.text();
  },
};