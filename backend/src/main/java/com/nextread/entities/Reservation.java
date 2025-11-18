// Reservation.java
package com.nextread.entities;

import java.sql.Date;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "reservations")
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;
    
    @Temporal(TemporalType.DATE)
    private Date reservedDate;
    
    @Temporal(TemporalType.DATE)
    private Date dueDate;
    
    private String status; // e.g., "Active", "Queue", "History"
    private Integer position; // For queue
    private String estimatedWait; // e.g., "28 Days"
}