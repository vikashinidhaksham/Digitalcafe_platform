package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.Menu;
import com.example.digitalcafe.repository.MenuRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "http://localhost:4200")
public class CustomerMenuController {

    private final MenuRepository menuRepository;

    public CustomerMenuController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @GetMapping("/menu/{cafeId}")
    public List<Menu> getMenuByCafe(@PathVariable Integer cafeId) {
        return menuRepository.findByCafeId(cafeId);
    }
}