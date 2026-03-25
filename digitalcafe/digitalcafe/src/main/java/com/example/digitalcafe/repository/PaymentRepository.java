package com.example.digitalcafe.repository;

import com.example.digitalcafe.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
public interface PaymentRepository extends JpaRepository<Payment, String> {
    @Query("""
SELECT p
FROM Payment p
JOIN Order o ON p.orderId = o.orderId
WHERE o.cafeId = :cafeId
""")
    List<Payment> findPaymentsByCafe(@Param("cafeId") Integer cafeId);

    @Query("""
SELECT p
FROM Payment p
JOIN Order o ON p.orderId = o.orderId
WHERE o.customerId = :customerId
""")
    List<Payment> findPaymentsByCustomer(@Param("customerId") Integer customerId);
}