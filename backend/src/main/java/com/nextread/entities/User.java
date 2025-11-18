// User.java
package com.nextread.entities;

import java.sql.Date;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String studentId;
    private String email;
    private String phone;
    private String password; // Hashed in real impl
    private String role; // e.g., "STUDENT", "ADMIN"
    private String membershipStatus; // e.g., "Active"
    
    @Temporal(TemporalType.DATE)
    private Date joinDate;
}