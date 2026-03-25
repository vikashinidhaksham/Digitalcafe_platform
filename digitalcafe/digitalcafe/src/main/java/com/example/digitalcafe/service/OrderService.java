package com.example.digitalcafe.service;

import com.example.digitalcafe.dto.OrderRequest;
import com.example.digitalcafe.entity.Order;
import com.example.digitalcafe.entity.OrderItem;
import com.example.digitalcafe.repository.OrderRepository;
import com.example.digitalcafe.repository.OrderItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Order createOrder(OrderRequest request) {

        Order order = new Order();

        // Unique order ID based on timestamp
        order.setOrderId("ORD" + System.currentTimeMillis());

        order.setBookingId(request.getBookingId());
        order.setCafeId(request.getCafeId());
        order.setCustomerId(request.getCustomerId());
        order.setTotalAmount(request.getTotalAmount());

        // Default statuses
        order.setChefStatus("PENDING");
        order.setWaiterStatus("PENDING");

        // ✅ FIX: always set ACTIVE so order_status is never NULL
        // This prevents "CANCELLED" check from failing on old rows
        order.setOrderStatus("ACTIVE");

        return orderRepo.save(order);
    }

    public void saveOrderItems(List<OrderItem> items){
        orderItemRepository.saveAll(items);
    }

    public Order updateChefStatus(String orderId,String chefStatus){

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setChefStatus(chefStatus);

        return orderRepository.save(order);
    }

    private String generateOrderId() {
        return "ORD" + System.currentTimeMillis();
    }
    public List<Object[]> getCustomerOrders(Integer customerId){

        return orderRepository.getCustomerOrders(customerId);

    }
}