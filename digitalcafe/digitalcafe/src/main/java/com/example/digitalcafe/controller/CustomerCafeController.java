package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.Cafe;
import com.example.digitalcafe.repository.CafeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerCafeController {

    private final CafeRepository cafeRepository;

    public CustomerCafeController(CafeRepository cafeRepository) {
        this.cafeRepository = cafeRepository;
    }

    // ===============================
    // GET ALL APPROVED CAFES
    // ===============================

    @GetMapping("/cafes")
    public List<Cafe> getApprovedCafes() {

        return cafeRepository.findByStatus("APPROVED");
    }
    @GetMapping("/cafe/{id}")
    public Cafe getCafeById(@PathVariable Integer id) {
        return cafeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cafe not found"));
    }

}