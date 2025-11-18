// BookRepository.java
package com.nextread.repositories;

import com.nextread.entities.Book;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Custom queries if needed, e.g., find by genre
    List<Book> findByGenre(String genre);
}