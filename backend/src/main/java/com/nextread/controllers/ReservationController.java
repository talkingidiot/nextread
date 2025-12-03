package com.nextread.controllers;

import com.nextread.entities.Reservation;
import com.nextread.entities.User;
import com.nextread.entities.Book;
import com.nextread.services.ReservationService;
import com.nextread.services.UserService;
import com.nextread.services.BookService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReservationController {
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private UserService userService;
    @Autowired
    private BookService bookService;
    
    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Reservation>> getUserReservations(
            @PathVariable Long userId, 
            @RequestParam String status) {
        return ResponseEntity.ok(reservationService.getReservationsByUserAndStatus(userId, status));
    }
    
    @PostMapping("/reserve")
    public ResponseEntity<?> reserve(@RequestBody ReserveRequest request) {
        User user = userService.getUserById(request.getUserId());
        Book book = bookService.getBookById(request.getBookId());
        
        if (user == null || book == null) {
            return ResponseEntity.badRequest().body("Invalid user or book ID");
        }
        
        // Check if user already has an active reservation for this book
        List<Reservation> userReservations = reservationService.getReservationsByUserAndStatus(
            user.getId(), "Active"
        );
        for (Reservation res : userReservations) {
            if (res.getBook().getId().equals(book.getId())) {
                return ResponseEntity.status(409)
                    .body("You already have an active reservation for this book");
            }
        }
        
        // Check queue reservations too
        List<Reservation> queueReservations = reservationService.getReservationsByUserAndStatus(
            user.getId(), "Queue"
        );
        for (Reservation res : queueReservations) {
            if (res.getBook().getId().equals(book.getId())) {
                return ResponseEntity.status(409)
                    .body("You are already in queue for this book");
            }
        }
        
        try {
            Reservation reservation = reservationService.reserveBook(
                user, 
                book, 
                request.getBorrowDays()
            );
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Failed to reserve book: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Reservation res = reservationService.getReservationById(id);
        if (res != null) {
            reservationService.cancelReservation(id);
            return ResponseEntity.ok("Reservation canceled");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/return")
    public ResponseEntity<?> returnBook(@PathVariable Long id) {
        Reservation res = reservationService.getReservationById(id);
        if (res != null) {
            reservationService.returnBook(id);
            return ResponseEntity.ok("Book returned successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DTO for reserve request
    @Data
    public static class ReserveRequest {
        private Long userId;
        private Long bookId;
        private Integer borrowDays; // Optional: how many days to borrow
    }
}