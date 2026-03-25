package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.User;
import com.example.digitalcafe.repository.UserRepository;
import com.example.digitalcafe.service.EmailService;
import com.example.digitalcafe.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/user/{id}")
    public User getUserById(@PathVariable int id) {
        return userRepository.findByUserId(id);
    }
    @GetMapping("/pending")
    public List<User> getPendingUsers() {
        return userRepository.findByStatus("PENDING");
    }
    @GetMapping("/approved")
    public List<User> getApprovedUsers() {
        return userRepository.findByStatus("APPROVED");
    }

    @PostMapping("/approve/{id}")
    public String approveUser(@PathVariable int id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String generatedPassword = authService.generateAdminPassword(8);

        try {

            System.out.println("Sending mail to: " + user.getEmail());

            emailService.sendEmail(
                    user.getEmail(),
                    "Registration Approved - Digital Cafe",
                    "Email: " + user.getEmail() +
                            "\nPassword: " + generatedPassword
            );

            System.out.println("Mail sent successfully");

            user.setPassword(authService.encodePassword(generatedPassword));
            user.setStatus("APPROVED");
            userRepository.save(user);
            System.out.println("Generated Password: " + generatedPassword);

            return "User Approved & Mail Sent Successfully";

        } catch (Exception e) {

            System.out.println("MAIL ERROR:");
            e.printStackTrace();

            return "Mail failed. User not approved.";
        }
    }



    @DeleteMapping("/reject/{id}")
    public String rejectUser(@PathVariable int id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {


            emailService.sendEmail(
                    user.getEmail(),
                    "Registration Rejected - Digital Cafe",
                    "Your registration request has been rejected.\n\n" +
                            "If you believe this is a mistake, please register again."
            );


            userRepository.delete(user);

            return "User Rejected & Mail Sent Successfully";

        } catch (Exception e) {

            throw new RuntimeException("Mail sending failed. User not deleted.");
        }
    }
}
