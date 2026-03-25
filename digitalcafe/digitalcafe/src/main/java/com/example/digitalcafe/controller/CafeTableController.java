package com.example.digitalcafe.controller;
import com.example.digitalcafe.repository.CafeTableRepository;
import com.example.digitalcafe.entity.CafeTable;
import com.example.digitalcafe.repository.CafeTableRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "*")
public class CafeTableController {

    @Autowired
    private CafeTableRepository tableRepo;
    @Autowired
    private CafeTableRepository cafeTableRepository;
    // ✅ Add Table
    @PostMapping
    public CafeTable addTable(@RequestBody CafeTable table) {

        if (table.getStatus() == null) {
            table.setStatus("AVAILABLE");
        }

        return tableRepo.save(table);
    }

    // ✅ Get All Tables of Cafe
    @GetMapping("/{cafeId}")
    public List<CafeTable> getTables(@PathVariable Integer cafeId) {
        return tableRepo.findByCafeId(cafeId);
    }

    // ✅ Search Tables by Guest Size
    @GetMapping("/search")
    public List<CafeTable> searchTables(
            @RequestParam Integer cafeId,
            @RequestParam Integer guestSize
    ) {

        return tableRepo
                .findByCafeIdAndSeatsGreaterThanEqualOrderBySeatsAsc(
                        cafeId,
                        guestSize
                );
    }
    @DeleteMapping("/{tableId}")
    public ResponseEntity<?> deleteTable(@PathVariable Integer tableId) {
        cafeTableRepository.deleteById(tableId);
        return ResponseEntity.ok(Map.of("message", "Table deleted"));
    }

}