package com.example.digitalcafe.repository;

import com.example.digitalcafe.entity.Query;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QueryRepository extends JpaRepository<Query, Long> {
}