package com.nextread.controller;

import com.nextread.model.Book;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {
    private final Map<Long, Book> store = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public BookController() {
        // Seed with a few example books
        Book b1 = new Book();
        b1.setId(idCounter.getAndIncrement());
        b1.setTitle("The Example Book");
        b1.setAuthor("Jane Doe");
        b1.setIsbn("978-1234567890");
        b1.setDescription("A demo book for NextRead.");
        b1.setRating(4.5);
        b1.setStatus("Available");
        b1.setCopies(3);
        b1.setPublishedDate("2024-01-10");
        b1.setImage("/book-1.svg");
        store.put(b1.getId(), b1);

        Book b2 = new Book();
        b2.setId(idCounter.getAndIncrement());
        b2.setTitle("Another Book");
        b2.setAuthor("John Smith");
        b2.setDescription("Another example entry.");
        b2.setRating(4.0);
        b2.setStatus("Available");
        b2.setCopies(1);
        b2.setImage("/book-2.svg");
        store.put(b2.getId(), b2);
    }

    @GetMapping
    public List<Book> getAll() {
        return new ArrayList<>(store.values());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getById(@PathVariable Long id) {
        Book b = store.get(id);
        if (b == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(b);
    }

    @PostMapping
    public ResponseEntity<Book> create(@RequestBody Book book) {
        long id = idCounter.getAndIncrement();
        book.setId(id);
        if (book.getStatus() == null) {
            book.setStatus(book.getCopies() > 0 ? "Available" : "Out of Stock");
        }
        store.put(id, book);
        return ResponseEntity.ok(book);
    }
}
