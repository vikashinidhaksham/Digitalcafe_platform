package com.example.digitalcafe.repository;

import java.util.List;
import com.example.digitalcafe.entity.Cafe;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CafeRepository extends JpaRepository<Cafe,Integer>{

    List<Cafe> findByOwnerId(Integer ownerId);
    List<Cafe> findByStatus(String status);
}