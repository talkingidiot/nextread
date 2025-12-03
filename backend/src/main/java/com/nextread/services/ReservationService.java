// ReservationService.java - COMPLETE VERSION WITH ALL METHODS
package com.nextread.services;

import com.nextread.entities.Reservation;
import com.nextread.entities.Book;
import com.nextread.entities.User;
import com.nextread.repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private BookService bookService;
    
    /**
     * Get reservations by user and status
     */
    public List<Reservation> getReservationsByUserAndStatus(Long userId, String status) {
        return reservationRepository.findByUserIdAndStatus(userId, status);
    }
    
    /**
     * Reserve a book for a user
     * If available, creates active reservation
     * If not available, adds to queue
     */
    public Reservation reserveBook(User user, Book book, Integer borrowDays) {
        // Check if book has available copies
        if (book.getAvailableCopies() > 0) {
            // Create active reservation
            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setBook(book);
            reservation.setStatus("Active");
            reservation.setReservedDate(Date.valueOf(LocalDate.now()));
            
            // Set due date based on borrow days (default 14 days)
            int daysToAdd = (borrowDays != null && borrowDays > 0) ? borrowDays : 14;
            reservation.setDueDate(Date.valueOf(LocalDate.now().plusDays(daysToAdd)));
            
            // Update book availability
            bookService.updateAvailability(book.getId(), -1);
            
            return reservationRepository.save(reservation);
        } else {
            // Add to queue
            Reservation reservation = new Reservation();
            reservation.setUser(user);
            reservation.setBook(book);
            reservation.setStatus("Queue");
            reservation.setReservedDate(Date.valueOf(LocalDate.now()));
            
            // Calculate queue position
            List<Reservation> queueReservations = reservationRepository.findByBookIdAndStatus(book.getId(), "Queue");
            reservation.setPosition(queueReservations.size() + 1);
            
            // Calculate estimated wait time (assuming 14 days per person in queue)
            int estimatedDays = reservation.getPosition() * 14;
            reservation.setEstimatedWait(estimatedDays + " Days");
            
            // Update book queue count
            book.setInQueue((book.getInQueue() != null ? book.getInQueue() : 0) + 1);
            bookService.saveBook(book);
            
            return reservationRepository.save(reservation);
        }
    }
    
    /**
     * Cancel a reservation
     * Handles both active and queue reservations
     * Promotes next person in queue if cancelling active reservation
     */
    public void cancelReservation(Long reservationId) {
        Reservation res = reservationRepository.findById(reservationId).orElse(null);
        if (res == null) {
            return;
        }
        
        if (res.getStatus().equals("Active")) {
            // Return the book copy
            bookService.updateAvailability(res.getBook().getId(), 1);
            
            // Check if there's a queue and move next person to active
            promoteNextInQueue(res.getBook().getId());
        } else if (res.getStatus().equals("Queue")) {
            // Remove from queue and update positions
            Book book = res.getBook();
            List<Reservation> queueReservations = reservationRepository.findByBookIdAndStatus(
                book.getId(), "Queue"
            );
            
            // Update positions for users after this one
            Integer cancelledPosition = res.getPosition();
            for (Reservation queueRes : queueReservations) {
                if (queueRes.getPosition() != null && 
                    cancelledPosition != null && 
                    queueRes.getPosition() > cancelledPosition &&
                    !queueRes.getId().equals(res.getId())) {
                    queueRes.setPosition(queueRes.getPosition() - 1);
                    queueRes.setEstimatedWait(((queueRes.getPosition()) * 14) + " Days");
                    reservationRepository.save(queueRes);
                }
            }
            
            // Update queue count
            if (book.getInQueue() != null && book.getInQueue() > 0) {
                book.setInQueue(book.getInQueue() - 1);
                bookService.saveBook(book);
            }
        }
        
        // Delete the reservation
        reservationRepository.delete(res);
    }
    
    /**
     * Return a book - marks reservation as History
     * Promotes next person in queue to active
     */
    public void returnBook(Long reservationId) {
        Reservation res = reservationRepository.findById(reservationId).orElse(null);
        if (res == null) {
            return;
        }
        
        if (!res.getStatus().equals("Active")) {
            return; // Can only return active reservations
        }
        
        // Mark as returned (History)
        res.setStatus("History");
        reservationRepository.save(res);
        
        // Return the book copy
        bookService.updateAvailability(res.getBook().getId(), 1);
        
        // Promote next person in queue to active
        promoteNextInQueue(res.getBook().getId());
    }
    
    /**
     * Helper method to promote next person in queue
     */
    private void promoteNextInQueue(Long bookId) {
        List<Reservation> queueReservations = reservationRepository.findByBookIdAndStatus(
            bookId, "Queue"
        );
        
        if (queueReservations.isEmpty()) {
            return;
        }
        
        // Sort by position and get first
        queueReservations.sort((a, b) -> 
            (a.getPosition() != null ? a.getPosition() : 0) - 
            (b.getPosition() != null ? b.getPosition() : 0)
        );
        
        Reservation nextReservation = queueReservations.get(0);
        nextReservation.setStatus("Active");
        nextReservation.setPosition(null);
        nextReservation.setEstimatedWait(null);
        nextReservation.setDueDate(Date.valueOf(LocalDate.now().plusDays(14)));
        reservationRepository.save(nextReservation);
        
        // Update positions for remaining queue
        for (int i = 1; i < queueReservations.size(); i++) {
            Reservation queueRes = queueReservations.get(i);
            queueRes.setPosition(i);
            queueRes.setEstimatedWait((i * 14) + " Days");
            reservationRepository.save(queueRes);
        }
        
        // Update book availability and queue count
        bookService.updateAvailability(bookId, -1);
        Book book = bookService.getBookById(bookId);
        if (book != null && book.getInQueue() != null && book.getInQueue() > 0) {
            book.setInQueue(book.getInQueue() - 1);
            bookService.saveBook(book);
        }
    }
    
    /**
     * Get a single reservation by ID
     */
    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id).orElse(null);
    }
    
    /**
     * Get all reservations (for admin)
     */
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}