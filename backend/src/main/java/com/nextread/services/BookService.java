// BookService.java - COMPLETE VERSION WITH ALL METHODS
package com.nextread.services;

import com.nextread.entities.Book;
import com.nextread.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;
    
    /**
     * Get all books from database
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    /**
     * Get a single book by ID
     */
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }
    
    /**
     * Save or update a book
     */
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
    
    /**
     * Delete a book by ID
     * This method removes the book from the database
     */
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
    
    /**
     * Update book availability after reservation or return
     * @param bookId - the ID of the book
     * @param change - positive number to add copies, negative to remove
     */
    public void updateAvailability(Long bookId, int change) {
        Book book = getBookById(bookId);
        if (book != null) {
            // Update available copies
            int newAvailableCopies = book.getAvailableCopies() + change;
            book.setAvailableCopies(newAvailableCopies);
            
            // Update status based on available copies
            if (newAvailableCopies > 0) {
                book.setStatus("Available");
            } else {
                book.setStatus("Out of Stock");
            }
            
            saveBook(book);
        }
    }
    
    /**
     * Get books by genre
     */
    public List<Book> getBooksByGenre(String genre) {
        return bookRepository.findByGenre(genre);
    }
}