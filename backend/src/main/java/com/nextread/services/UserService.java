// UserService.java - COMPLETE VERSION WITH ALL METHODS
package com.nextread.services;

import com.nextread.controllers.UserController;
import com.nextread.entities.User;
import com.nextread.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Date;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    /**
     * Authenticate user with email and password
     * In production, use BCrypt for password hashing
     */
    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        // TODO: Add password hashing/checking logic (e.g., BCrypt)
        return user != null && user.getPassword().equals(password) ? user : null;
    }
    
    /**
     * Get user by ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    /**
     * Check if user exists by email
     */
    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * Create a new user (Registration)
     */
    public User createUser(String name, String email, String password, String studentId, String phone) {
        if (userExists(email)) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // TODO: In production, hash this with BCrypt
        user.setStudentId(studentId);
        user.setPhone(phone);
        user.setRole("STUDENT"); // Default role for new registrations
        user.setMembershipStatus("Active");
        user.setJoinDate(new Date(System.currentTimeMillis()));

        return userRepository.save(user);
    }
    
    /**
     * Get all users (for admin)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * Update user information
     */
    public User updateUser(Long id, UserController.UpdateUserRequest request) {
        User user = getUserById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Update name if provided
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName());
        }
        
        // Update email if provided and not already taken by another user
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            User existingUser = userRepository.findByEmail(request.getEmail()).orElse(null);
            if (existingUser != null && !existingUser.getId().equals(id)) {
                throw new RuntimeException("Email already in use by another user");
            }
            user.setEmail(request.getEmail());
        }
        
        // Update phone if provided
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        // Update student ID if provided
        if (request.getStudentId() != null && !request.getStudentId().trim().isEmpty()) {
            user.setStudentId(request.getStudentId());
        }
        
        return userRepository.save(user);
    }
    
    /**
     * Delete a user
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}