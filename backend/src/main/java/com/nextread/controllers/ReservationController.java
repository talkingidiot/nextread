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
@CrossOrigin(origins = "http://localhost:5173")
public class ReservationController {
    @Autowired
    private ReservationService reservationService;
    @Autowired
    private UserService userService;
    @Autowired
    private BookService bookService;
    
    @GetMapping("/user/{userId}")
    public List<Reservation> getUserReservations(@PathVariable Long userId, @RequestParam String status) {
        return reservationService.getReservationsByUserAndStatus(userId, status);
    }
    
    @PostMapping("/reserve")
    public ResponseEntity<?> reserve(@RequestBody ReserveRequest request) {
        User user = userService.getUserById(request.getUserId());
        Book book = bookService.getBookById(request.getBookId());
        
        if (user == null || book == null) {
            return ResponseEntity.badRequest().body("Invalid user or book ID");
        }
        
        Reservation reservation = reservationService.reserveBook(user, book);
        if (reservation != null) {
            return ResponseEntity.ok(reservation);
        } else {
            return ResponseEntity.status(409).body("Book not available for reservation"); // Conflict
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Reservation res = reservationService.getReservationById(id); // Assuming you add this to ReservationService
        if (res != null) {
            reservationService.cancelReservation(id);
            return ResponseEntity.ok("Reservation canceled");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // DTO for reserve request
    @Data
    public static class ReserveRequest {
        private Long userId;
        private Long bookId;
    }
}