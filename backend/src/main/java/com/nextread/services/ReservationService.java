// ReservationService.java
package com.nextread.services;

import com.nextread.entities.Reservation;
import com.nextread.entities.Book;
import com.nextread.entities.User;
import com.nextread.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private BookService bookService;
    
    public List<Reservation> getReservationsByUserAndStatus(Long userId, String status) {
        return reservationRepository.findByUserIdAndStatus(userId, status);
    }
    
    public Reservation reserveBook(User user, Book book) {
        if (book.getAvailableCopies() > 0) {
            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setBook(book);
            reservation.setStatus("Active");
            // Set dates, etc.
            bookService.updateAvailability(book.getId(), -1);
            return reservationRepository.save(reservation);
        }
        return null; // Or add to queue
    }
    
    public void cancelReservation(Long reservationId) {
        Reservation res = reservationRepository.findById(reservationId).orElse(null);
        if (res != null) {
            bookService.updateAvailability(res.getBook().getId(), 1);
            reservationRepository.delete(res);
        }
    }
    
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }
}