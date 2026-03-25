package com.example.digitalcafe.repository;

import com.example.digitalcafe.entity.CafeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CafeTableRepository
        extends JpaRepository<CafeTable, Integer> {

    List<CafeTable> findByCafeId(Integer cafeId);

    List<CafeTable> findByCafeIdAndSeatsGreaterThanEqualOrderBySeatsAsc(
            Integer cafeId,
            Integer seats
    );
}