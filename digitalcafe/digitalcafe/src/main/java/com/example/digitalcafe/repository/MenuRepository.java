package com.example.digitalcafe.repository;

import com.example.digitalcafe.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuRepository extends JpaRepository<Menu,Integer> {

    List<Menu> findByCafeId(Integer cafeId);
    void deleteByCafeId(Integer cafeId);

}