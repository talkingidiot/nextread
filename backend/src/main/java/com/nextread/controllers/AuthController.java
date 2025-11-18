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
    
    // DTO for login request
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }
}