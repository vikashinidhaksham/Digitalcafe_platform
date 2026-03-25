package com.example.digitalcafe.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.digitalcafe.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    /* ============================= */
    /* TOP FOODS FOR CUSTOMER DASHBOARD */
    /* ============================= */

    @Query(value = """
    SELECT 
    m.name as name,
    m.price as price,
    m.cafe_id as cafeId,
    (
     SELECT image_name
     FROM menu_images
     WHERE menu_id = m.id
     LIMIT 1
    ) as image,
    SUM(oi.qty) as total
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN menu m ON oi.menu_id = m.id
    WHERE o.customer_id = :customerId
    GROUP BY m.id,m.name,m.price,m.cafe_id
    ORDER BY total DESC
    LIMIT 3
    """, nativeQuery = true)
    List<Map<String,Object>> getTopFoodsByCustomer(@Param("customerId") Integer customerId);


    /* ============================= */
    /* ORDER ITEMS FOR CUSTOMER ORDERS */
    /* ============================= */

    @Query(value = """
    SELECT 
    m.name AS menuName,
    oi.qty AS qty,
    m.price AS price
    FROM order_items oi
    JOIN menu m ON oi.menu_id = m.id
    WHERE oi.order_id = :orderId
    """, nativeQuery = true)
    List<Map<String,Object>> getItemsForChef(@Param("orderId") String orderId);


    /* ============================= */
    /* NORMAL JPA METHOD */
    /* ============================= */

    List<OrderItem> findByOrderId(String orderId);

}