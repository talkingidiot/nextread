// UserService.java
package com.nextread.services;

import com.nextread.entities.User;
import com.nextread.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.sql.Date;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        // Add password hashing/checking logic (e.g., BCrypt)
        return user != null && user.getPassword().equals(password) ? user : null;
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public boolean userExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public User createUser(String name, String email, String password, String studentId, String phone) {
        if (userExists(email)) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // In production, hash this with BCrypt
        user.setStudentId(studentId);
        user.setPhone(phone);
        user.setRole("STUDENT"); // Default role for new registrations
        user.setMembershipStatus("Active");
        user.setJoinDate(new Date(System.currentTimeMillis()));

        return userRepository.save(user);
    }
}