package com.example.digitalcafe.controller;

import com.example.digitalcafe.dto.ChefOrderDTO;
import com.example.digitalcafe.repository.OrderRepository;
import com.example.digitalcafe.repository.OrderItemRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class ChefController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository itemRepo;

    public ChefController(OrderRepository orderRepo,
                          OrderItemRepository itemRepo){
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
    }

    @GetMapping("/chef/{cafeId}")
    public List<ChefOrderDTO> getChefOrders(@PathVariable Integer cafeId){

        List<Object[]> rows = orderRepo.getChefOrders(cafeId);

        List<ChefOrderDTO> result = new ArrayList<>();

        for(Object[] r : rows){

            String orderId = (String) r[0];

            Integer tableNo = r[1] != null
                    ? ((Number) r[1]).intValue()
                    : null;

            String chefStatus = (String) r[2];

            LocalDate bookingDate = null;
            if(r[3] != null){
                bookingDate = ((java.sql.Date) r[3]).toLocalDate();
            }

            String bookingTime = (String) r[4];

            List<Map<String,Object>> items =
                    itemRepo.getItemsForChef(orderId);

            result.add(
                    new ChefOrderDTO(
                            orderId,
                            tableNo,
                            chefStatus,
                            bookingDate,
                            bookingTime,
                            items
                    )
            );
        }

        return result;
    }
}