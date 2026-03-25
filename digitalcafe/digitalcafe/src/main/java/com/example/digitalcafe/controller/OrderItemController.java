package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.OrderItem;
import com.example.digitalcafe.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin
public class OrderItemController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    /* SAVE ORDER ITEMS */
    @PostMapping
    public List<OrderItem> saveOrderItems(@RequestBody List<OrderItem> items) {
        return orderItemRepository.saveAll(items);
    }

    /* NEW API FOR CHEF DASHBOARD */

    @GetMapping("/{orderId}")
    public List<OrderItem> getItemsByOrder(@PathVariable String orderId){
        return orderItemRepository.findByOrderId(orderId);
    }
}