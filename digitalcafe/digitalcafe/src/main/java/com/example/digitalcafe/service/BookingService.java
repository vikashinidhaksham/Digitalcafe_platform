package com.example.digitalcafe.service;

import com.example.digitalcafe.entity.TableBooking;
import com.example.digitalcafe.repository.TableBookingRepository;

import org.springframework.stereotype.Service;

@Service
public class BookingService {

    private final TableBookingRepository repo;

    public BookingService(TableBookingRepository repo){
        this.repo=repo;
    }

    public TableBooking book(TableBooking booking){

        boolean exists =
                repo.existsByCafeIdAndTableIdAndBookingDateAndBookingTimeAndStatus(
                        booking.getCafeId(),
                        booking.getTableId(),
                        booking.getBookingDate(),
                        booking.getBookingTime(),
                        "CONFIRMED"
                );

        if(exists){
            throw new RuntimeException("Table already booked");
        }

        String bookingId =
                "BKG"+System.currentTimeMillis();

        booking.setBookingId(bookingId);

        booking.setStatus("CONFIRMED");

        return repo.save(booking);
    }
}