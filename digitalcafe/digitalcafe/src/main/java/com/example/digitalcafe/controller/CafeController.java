package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.Cafe;
import com.example.digitalcafe.repository.CafeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cafe")
@CrossOrigin(origins="*")
public class CafeController {

    @Autowired
    private CafeRepository cafeRepo;

    @GetMapping("/{id}")
    public Cafe getCafeById(@PathVariable Integer id) {
        return cafeRepo.findById(id).orElse(null);
    }
}