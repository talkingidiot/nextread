// UserRepository.java
package com.nextread.repositories;

import com.nextread.entities.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // For login
    Optional<User> findByEmail(String email);
}