// Updated BookController.java with PUT and DELETE methods
package com.nextread.controllers;

import com.nextread.entities.Book;
import com.nextread.services.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class BookController {
    @Autowired
    private BookService bookService;
    
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        if (book != null) {
            return ResponseEntity.ok(book);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        // Set status based on available copies
        if (book.getAvailableCopies() > 0) {
            book.setStatus("Available");
        } else {
            book.setStatus("Out of Stock");
        }
        
        // Set default values if not provided
        if (book.getInQueue() == null) {
            book.setInQueue(0);
        }
        if (book.getRating() == null) {
            book.setRating(0.0);
        }
        
        Book savedBook = bookService.saveBook(book);
        return ResponseEntity.ok(savedBook);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book book) {
        Book existingBook = bookService.getBookById(id);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        
        // Update fields
        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setGenre(book.getGenre());
        existingBook.setRating(book.getRating());
        existingBook.setTotalCopies(book.getTotalCopies());
        existingBook.setAvailableCopies(book.getAvailableCopies());
        existingBook.setDescription(book.getDescription());
        
        // Update status based on available copies
        if (book.getAvailableCopies() > 0) {
            existingBook.setStatus("Available");
        } else {
            existingBook.setStatus("Out of Stock");
        }
        
        Book updatedBook = bookService.saveBook(existingBook);
        return ResponseEntity.ok(updatedBook);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        Book book = bookService.getBookById(id);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        
        bookService.deleteBook(id);
        return ResponseEntity.ok("Book deleted successfully");
    }
}