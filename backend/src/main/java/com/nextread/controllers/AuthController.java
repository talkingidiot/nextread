package com.nextread.controllers;

import com.nextread.entities.User;
import com.nextread.services.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.authenticate(request.getEmail(), request.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user); // Return user on success
        } else {
            return ResponseEntity.status(401).body("Invalid credentials"); // Unauthorized
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Check if user already exists
            if (userService.userExists(request.getEmail())) {
                return ResponseEntity.status(400).body("Email already registered");
            }

            // Create new user
            User user = userService.createUser(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getStudentId(),
                request.getPhone()
            );

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Registration failed: " + e.getMessage());
        }
    }
    
    // DTO for login request
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    // DTO for register request
    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String studentId;
        private String phone;
    }
}