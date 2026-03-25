package com.example.digitalcafe.repository;

import com.example.digitalcafe.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

    @Query("SELECT COUNT(o) FROM Order o WHERE o.customerId = :customerId")
    long countByCustomerId(@Param("customerId") Integer customerId);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.customerId = :customerId")
    Double sumAmountByCustomerId(@Param("customerId") Integer customerId);

    List<Order> findByCafeId(Integer cafeId);

    /* ── CHEF DASHBOARD ── */
    @Query(value = """
        SELECT
          o.order_id,
          tb.table_id,
          o.chef_status,
          tb.booking_date,
          tb.booking_time
        FROM orders o
        JOIN table_booking tb ON o.booking_id = tb.booking_id
        WHERE o.cafe_id = :cafeId
          AND (o.order_status IS NULL OR o.order_status != 'CANCELLED')
        ORDER BY tb.booking_date, tb.booking_time
        """, nativeQuery = true)
    List<Object[]> getChefOrders(@Param("cafeId") Integer cafeId);

    /* ── WAITER DASHBOARD ── */
    @Query(value = """
        SELECT
          o.order_id,
          tb.table_id,
          o.waiter_status,
          tb.booking_date,
          tb.booking_time
        FROM orders o
        JOIN table_booking tb ON o.booking_id = tb.booking_id
        WHERE o.cafe_id = :cafeId
          AND o.waiter_status = 'READY'
          AND (o.order_status IS NULL OR o.order_status != 'CANCELLED')
        ORDER BY tb.booking_date, tb.booking_time
        """, nativeQuery = true)
    List<Object[]> getWaiterOrders(@Param("cafeId") Integer cafeId);

    /* ── CUSTOMER ORDERS ── */
    // FIX: subquery on payments to avoid duplicate rows when multiple
    // payment records exist for the same order
    @Query(value = """
        SELECT
          o.order_id,
          c.name                                    AS cafe_name,
          ct.id                                     AS table_no,
          ct.table_name,
          tb.last_name,
          o.booking_id,
          p.payment_id,
          tb.booking_date,
          tb.booking_time,
          o.total_amount,
          o.chef_status,
          o.waiter_status,
          COALESCE(p.payment_method, 'CASH')        AS payment_method,
          COALESCE(o.order_status, 'ACTIVE')        AS order_status,
          o.cafe_id
        FROM orders o
        JOIN cafes c           ON o.cafe_id    = c.id
        JOIN table_booking tb  ON o.booking_id = tb.booking_id
        LEFT JOIN cafe_tables ct ON tb.table_id = ct.id
        LEFT JOIN (
            SELECT p2.order_id, p2.payment_id, p2.payment_method
            FROM payments p2
            INNER JOIN (
                SELECT order_id, MAX(payment_id) AS max_pid
                FROM payments
                GROUP BY order_id
            ) latest ON p2.order_id = latest.order_id
                     AND p2.payment_id = latest.max_pid
        ) p ON o.order_id = p.order_id
        WHERE o.customer_id = :customerId
        ORDER BY tb.booking_date DESC, o.order_id DESC
        """, nativeQuery = true)
    List<Object[]> getCustomerOrders(@Param("customerId") Integer customerId);

    /* ── ADMIN / REVENUE ── */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalRevenue();

    @Query("""
        SELECT FUNCTION('DATE', o.createdAt), SUM(o.totalAmount)
        FROM Order o
        WHERE o.createdAt >= :startDate
        GROUP BY FUNCTION('DATE', o.createdAt)
        ORDER BY FUNCTION('DATE', o.createdAt)
        """)
    List<Object[]> getWeeklyRevenue(@Param("startDate") LocalDateTime startDate);

    @Query("""
        SELECT SUM(o.totalAmount)
        FROM Order o
        WHERE o.createdAt >= :start AND o.createdAt < :end
        """)
    Double getTodayRevenue(@Param("start") LocalDateTime start,
                           @Param("end")   LocalDateTime end);
}