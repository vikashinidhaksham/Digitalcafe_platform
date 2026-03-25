package com.example.digitalcafe.controller;
import com.example.digitalcafe.repository.OrderItemRepository;
import com.example.digitalcafe.dto.OrderRequest;
import com.example.digitalcafe.dto.ChefOrderDTO;
import com.example.digitalcafe.entity.Order;
import java.util.ArrayList;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import com.example.digitalcafe.dto.CustomerOrderDTO;
import com.example.digitalcafe.service.OrderService;
import com.example.digitalcafe.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/orders")
@CrossOrigin
public class OrderController {
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) {

        return orderService.createOrder(request);

    }

    @Autowired
    private OrderRepository orderRepo;

    @GetMapping("/cafe/{cafeId}")
    public List<Order> getOrdersByCafe(@PathVariable Integer cafeId){

        return orderRepo.findByCafeId(cafeId);

    }
    @PutMapping("/chef-status/{orderId}")
    public Order updateChefStatus(
            @PathVariable String orderId,
            @RequestParam String status){

        Order order = orderRepo.findById(orderId).orElseThrow();

        order.setChefStatus(status);
        if("COMPLETED".equals(status)){
            order.setWaiterStatus("READY");
        }

        return orderRepo.save(order);
    }
    @GetMapping("/waiter/{cafeId}")
    public List<ChefOrderDTO> getWaiterOrders(@PathVariable Integer cafeId){

        List<Object[]> rows = orderRepo.getWaiterOrders(cafeId);

        List<ChefOrderDTO> result = new ArrayList<>();

        for(Object[] r : rows){

            String orderId = (String) r[0];

            Integer tableNo = r[1] != null
                    ? ((Number) r[1]).intValue()
                    : null;

            String waiterStatus = r[2] != null ? r[2].toString() : "PENDING";

            java.time.LocalDate bookingDate = null;

            if(r[3] != null){
                bookingDate = ((java.sql.Date) r[3]).toLocalDate();
            }

            String bookingTime = (String) r[4];

            List<Map<String,Object>> items =
                    orderItemRepository.getItemsForChef(orderId);

            result.add(
                    new ChefOrderDTO(
                            orderId,
                            tableNo,
                            waiterStatus,
                            bookingDate,
                            bookingTime,
                            items
                    )
            );
        }

        return result;
    }

    @PutMapping("/waiter-status/{orderId}")
    public Order updateWaiterStatus(
            @PathVariable String orderId,
            @RequestParam String status){

        Order order = orderRepo.findById(orderId).orElseThrow();

        if(order.getWaiterStatus().equals("READY")){
            order.setWaiterStatus(status);
        }

        return orderRepo.save(order);
    }
    // In getCustomerOrders, update the row mapping to read index 12,13,14
    @GetMapping("/customer/{customerId}")
    public List<CustomerOrderDTO> getCustomerOrders(@PathVariable Integer customerId){

        List<Object[]> rows = orderRepo.getCustomerOrders(customerId);
        List<CustomerOrderDTO> result = new ArrayList<>();

        for(Object[] r : rows){

            String orderId       = (String)  r[0];   // order_id
            String cafeName      = (String)  r[1];   // cafe_name
            Integer tableNo      = r[2] != null ? ((Number) r[2]).intValue() : null; // table_no
            String tableName     = (String)  r[3];   // table_name
            String lastName      = (String)  r[4];   // last_name
            String bookingId     = (String)  r[5];   // booking_id
            String paymentId     = (String)  r[6];   // payment_id

            java.time.LocalDate bookingDate = null;
            if(r[7] != null){
                bookingDate = ((java.sql.Date) r[7]).toLocalDate();
            }

            String bookingTime   = (String)  r[8];   // booking_time
            Double totalAmount   = r[9]  != null ? ((Number) r[9]).doubleValue()  : 0.0; // total_amount
            String chefStatus    = (String)  r[10];  // chef_status
            String waiterStatus  = (String)  r[11];  // waiter_status
            String paymentMethod = (String)  r[12];  // payment_method (COALESCE → never null)
            String orderStatus   = (String)  r[13];  // order_status
            Integer cafeId       = r[14] != null ? ((Number) r[14]).intValue() : null; // cafe_id

            List<Map<String,Object>> items =
                    orderItemRepository.getItemsForChef(orderId);

            result.add(new CustomerOrderDTO(
                    orderId, cafeName, tableNo, tableName, lastName,
                    bookingId, paymentId, bookingDate, bookingTime,
                    totalAmount, chefStatus, waiterStatus,
                    paymentMethod, orderStatus, cafeId,
                    items
            ));
        }

        return result;
    }

    // ADD this new cancel endpoint
    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable String orderId){
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setOrderStatus("CANCELLED");
        orderRepo.save(order);
        return ResponseEntity.ok(Map.of("message", "Order cancelled"));
    }
}