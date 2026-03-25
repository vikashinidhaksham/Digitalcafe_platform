package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.Payment;
import com.example.digitalcafe.service.PaymentService;
import com.example.digitalcafe.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentRepository paymentRepo;   // FIX: inject repository


    /* ==========================
       CREATE PAYMENT
       ========================== */
    @PostMapping
    public Payment makePayment(@RequestBody Payment payment){

        return paymentService.savePayment(payment);

    }


    /* ==========================
       GET PAYMENTS BY CAFE
       ========================== */
    @GetMapping("/cafe/{cafeId}")
    public List<Payment> getPaymentsByCafe(@PathVariable Integer cafeId){

        return paymentRepo.findPaymentsByCafe(cafeId);

    }
    @GetMapping("/customer/{customerId}")
    public List<Payment> getPaymentsByCustomer(@PathVariable Integer customerId){
        return paymentRepo.findPaymentsByCustomer(customerId);
    }
    @PostMapping("/create-order")
    public Map<String,Object> createRazorpayOrder(@RequestBody Map<String,Object> data) throws Exception {

        Number amount = (Number) data.get("amount");
        double amountValue = amount.doubleValue();

        int finalAmount = amount.intValue();

        RazorpayClient client = new RazorpayClient("rzp_test_SQJs88CuZgOLMM", "3kMGcu5YRJrWeHt1UqeIWB7v");

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", finalAmount * 100); // convert to paise
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "order_" + System.currentTimeMillis());

        Order order = client.orders.create(orderRequest);

        Map<String,Object> response = new HashMap<>();
        response.put("id", order.get("id"));
        response.put("amount", order.get("amount"));

        return response;
    }

}