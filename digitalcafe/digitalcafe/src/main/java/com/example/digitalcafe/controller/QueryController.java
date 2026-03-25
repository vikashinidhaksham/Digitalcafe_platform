package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.Query;
import com.example.digitalcafe.repository.QueryRepository;
import com.example.digitalcafe.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/query")
public class QueryController {

    @Autowired
    private QueryRepository repo;

    @Autowired
    private EmailService emailService;

    // ✅ 1. SAVE QUERY (USER)
    @PostMapping("/save")
    public Query saveQuery(@RequestBody Query q) {
        q.setStatus("PENDING");
        return repo.save(q);
    }

    // ✅ 2. GET ALL QUERIES (ADMIN)
    @GetMapping("/all")
    public List<Query> getAllQueries() {
        return repo.findAll();
    }

    // ✅ 3. SEND REPLY + EMAIL
    @PostMapping("/reply/{id}")
    public String replyToUser(@PathVariable Long id, @RequestBody Query body) {

        Query q = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Query not found"));

        q.setReply(body.getReply());
        q.setStatus("REPLIED");

        repo.save(q);

        // 🔥 SEND EMAIL
        emailService.sendEmail(
                q.getEmail(),
                "Reply from Savour Support",
                body.getReply()
        );

        return "Reply sent successfully";
    }
}