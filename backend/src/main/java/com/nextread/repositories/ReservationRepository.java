// ReservationRepository.java
package com.nextread.repositories;

import com.nextread.entities.Reservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Custom queries, e.g., find by user and status
    List<Reservation> findByUserIdAndStatus(Long userId, String status);
}