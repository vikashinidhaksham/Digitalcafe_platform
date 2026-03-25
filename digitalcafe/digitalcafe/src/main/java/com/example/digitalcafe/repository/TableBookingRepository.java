package com.example.digitalcafe.repository;

import com.example.digitalcafe.entity.TableBooking;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TableBookingRepository
        extends JpaRepository<TableBooking,String>{

    boolean existsByCafeIdAndTableIdAndBookingDateAndBookingTimeAndStatus(
            Integer cafeId,
            Integer tableId,
            LocalDate bookingDate,
            String bookingTime,
            String status
    );

    @Query("""
       SELECT tb.tableId
       FROM TableBooking tb
       WHERE tb.cafeId = :cafeId
       AND tb.bookingDate = :bookingDate
       AND tb.bookingTime = :time
       AND tb.status IN ('BOOKED','CONFIRMED')
       """)
    List<Integer> findBookedTableIds(
            @Param("cafeId") Integer cafeId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("time") String time
    );

    @Query("""
SELECT tb
FROM TableBooking tb
WHERE tb.cafeId = :cafeId
AND tb.bookingDate = :bookingDate
AND tb.status IN ('BOOKED','CONFIRMED')
""")
    List<TableBooking> findBookingsByDate(
            @Param("cafeId") Integer cafeId,
            @Param("bookingDate") LocalDate bookingDate
    );
    List<TableBooking> findByCustomerId(Integer customerId);
    List<TableBooking> findByCafeId(Integer cafeId);
    long countByCustomerId(Integer customerId);
}
