// Book.java
package com.nextread.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "books")
@Data
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String author;
    private String isbn;
    private String genre;
    private Double rating;
    private Integer totalCopies;
    private Integer availableCopies;
    private Integer inQueue;
    
    @Column(length = 1000)
    private String description;
    
    private String status; // e.g., "Available", "Out of Stock"
}