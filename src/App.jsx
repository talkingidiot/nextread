import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import BookDetails from './pages/BookDetails'
import Profile from './pages/Profile'
import MyReservations from './pages/MyReservations'

export default function App() {
  // TODO: check if user is logged in (localStorage token, etc.)
  const isLoggedIn = false

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reservations" element={<MyReservations />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
