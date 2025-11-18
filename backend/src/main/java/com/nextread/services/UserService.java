// UserService.java
package com.nextread.services;

import com.nextread.entities.User;
import com.nextread.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}