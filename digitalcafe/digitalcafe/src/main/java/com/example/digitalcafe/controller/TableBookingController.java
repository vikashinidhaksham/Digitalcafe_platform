package com.example.digitalcafe.controller;
import java.util.*;
import com.example.digitalcafe.entity.TableBooking;
import com.example.digitalcafe.repository.TableBookingRepository;
import com.example.digitalcafe.entity.User;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import com.example.digitalcafe.repository.UserRepository;
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class TableBookingController {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private TableBookingRepository bookingRepo;


    /* ======================================
       GET BOOKED TABLES BY DATE + TIME
       ====================================== */
    @GetMapping("/{cafeId}/{date}/{time}")
    public List<Integer> getBookedTables(
            @PathVariable Integer cafeId,
            @PathVariable String date,
            @PathVariable String time) {

        LocalDate bookingDate = LocalDate.parse(date);

        return bookingRepo.findBookedTableIds(
                cafeId,
                bookingDate,
                time
        );
    }


    /* ======================================
       CREATE TABLE BOOKING
       ====================================== */

    @PostMapping
    public ResponseEntity<?> bookTable(@RequestBody TableBooking booking) {

        try {

            boolean alreadyBooked =
                    bookingRepo.existsByCafeIdAndTableIdAndBookingDateAndBookingTimeAndStatus(
                            booking.getCafeId(),
                            booking.getTableId(),
                            booking.getBookingDate(),
                            booking.getBookingTime(),
                            "BOOKED"
                    );

            if (alreadyBooked) {
                return ResponseEntity
                        .badRequest()
                        .body("Table already booked at this time");
            }

            // generate booking id
            booking.setBookingId("BKG" + System.currentTimeMillis());

            // set booking status
            booking.setStatus("BOOKED");

            // set booking creation time
            booking.setCreatedAt(java.time.LocalDateTime.now());

            // get last name from user table
            User user = userRepo.findById(booking.getCustomerId()).orElse(null);

            if (user != null && user.getPersonalDetails() != null) {

                ObjectMapper mapper = new ObjectMapper();
                JsonNode node = mapper.readTree(user.getPersonalDetails());

                if (node.has("lastName")) {
                    booking.setLastName(node.get("lastName").asText());
                }
            }

            bookingRepo.save(booking);

            return ResponseEntity.ok(
                    java.util.Map.of(
                            "message", "Booking successful",
                            "bookingId", booking.getBookingId()
                    )
            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.internalServerError()
                    .body("Booking failed");

        }
    }

    @GetMapping("/details/{cafeId}/{date}")
    public List<TableBooking> getBookingDetails(
            @PathVariable Integer cafeId,
            @PathVariable String date) {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate bookingDate = LocalDate.parse(date.trim(), formatter);

        return bookingRepo.findBookingsByDate(cafeId, bookingDate);
    }
    /* ======================================
   GET BOOKINGS FOR CALENDAR
   ====================================== */

    @GetMapping("/calendar/{customerId}")
    public List<TableBooking> getBookingsForCalendar(
            @PathVariable Integer customerId){

        return bookingRepo.findByCustomerId(customerId);

    }
    /* ======================================
   GET ALL BOOKINGS BY CAFE
   ====================================== */

    @GetMapping("/cafe/{cafeId}")
    public List<TableBooking> getBookingsByCafe(@PathVariable Integer cafeId){

        return bookingRepo.findByCafeId(cafeId);

    }
    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<?> cancelBooking(@PathVariable String bookingId) {
        TableBooking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus("CANCELLED");
        bookingRepo.save(booking);
        return ResponseEntity.ok(Map.of("message", "Booking cancelled"));
    }
}