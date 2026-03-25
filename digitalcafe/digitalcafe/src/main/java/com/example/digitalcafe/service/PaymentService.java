package com.example.digitalcafe.service;

import com.example.digitalcafe.entity.Payment;
import com.example.digitalcafe.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public Payment savePayment(Payment payment){

        payment.setPaymentId(generatePaymentId());
        payment.setStatus("SUCCESS");

        return paymentRepository.save(payment);
    }
    private String generatePaymentId() {
        return "PAY" + System.currentTimeMillis();
    }

}