package com.example.digitalcafe.controller;
import com.example.digitalcafe.repository.OrderRepository;
import com.example.digitalcafe.repository.UserRepository;
import com.example.digitalcafe.repository.OrderItemRepository;
import com.example.digitalcafe.repository.TableBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private TableBookingRepository bookingRepo;
    @Autowired
    private OrderItemRepository orderItemRepo;
    @GetMapping("/customer/{customerId}")
    public Map<String,Object> getDashboard(@PathVariable Integer customerId){
        Map<String,Object> map = new HashMap<>();
        long totalOrders = orderRepo.countByCustomerId(customerId);
        Double totalAmount = orderRepo.sumAmountByCustomerId(customerId);
        if(totalAmount == null) totalAmount = 0.0;
        long reservations = bookingRepo.countByCustomerId(customerId);
        List<Map<String,Object>> topFoods = new ArrayList<>();
        try{
            topFoods = orderItemRepo.getTopFoodsByCustomer(customerId);
        }catch(Exception e){
            System.out.println("Top foods query error: " + e.getMessage());
        }
        map.put("totalOrders", totalOrders);
        map.put("totalAmount", totalAmount);
        map.put("reservations", reservations);
        map.put("topFoods", topFoods);
        return map;
    }
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/admin/revenue")
    public Double getTotalRevenue(){
        return orderRepository.getTotalRevenue();
    }
    @GetMapping("/user-distribution")
    public Map<String, Long> getUserDistribution(){
        List<Object[]> data = userRepository.getUserRoleCounts();
        Map<String, Long> result = new HashMap<>();
        for(Object[] row : data){
            result.put(row[0].toString(), (Long) row[1]);
        }
        return result;
    }
    @GetMapping("/today-revenue")
    public Double getTodayRevenue(){
        LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        Double revenue = orderRepository.getTodayRevenue(start, end);
        return revenue != null ? revenue : 0.0;
    }
    @GetMapping("/weekly-revenue")
    public List<Map<String,Object>> getWeeklyRevenue(){
        LocalDateTime startDate = LocalDateTime.now().minusDays(7);
        List<Object[]> data = orderRepository.getWeeklyRevenue(startDate);
        List<Map<String,Object>> result = new ArrayList<>();
        for(Object[] row : data){
            Map<String,Object> map = new HashMap<>();
            map.put("date", row[0].toString());
            map.put("amount", row[1]);
            result.add(map);
        }
        return result;
    }
}