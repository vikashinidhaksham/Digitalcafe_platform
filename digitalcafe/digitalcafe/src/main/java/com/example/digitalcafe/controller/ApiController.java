package com.example.digitalcafe.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ApiController {

    @GetMapping("/api/status")
    public String status() {
        return "Digital Cafe is running";
    }
}
