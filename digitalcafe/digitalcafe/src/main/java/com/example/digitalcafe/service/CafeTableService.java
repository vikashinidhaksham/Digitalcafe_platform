package com.example.digitalcafe.service;

import com.example.digitalcafe.entity.CafeTable;
import com.example.digitalcafe.repository.CafeTableRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CafeTableService {

    private final CafeTableRepository repo;

    public CafeTableService(CafeTableRepository repo) {
        this.repo = repo;
    }

    public List<CafeTable> getTablesByGuestSize(Integer cafeId, Integer guestSize) {
        return repo.findByCafeIdAndSeatsGreaterThanEqualOrderBySeatsAsc(
                cafeId,
                guestSize
        );
    }
}