package com.example.digitalcafe.service;
import jakarta.annotation.PostConstruct;
import com.example.digitalcafe.dto.RegisterRequest;
import com.example.digitalcafe.dto.LoginRequest;
import com.example.digitalcafe.entity.User;
import com.example.digitalcafe.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.digitalcafe.dto.ChangePassword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private String generatePassword(int length) {

        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();

        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }

        return password.toString();
    }


    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email)) {
            throw new RuntimeException("Email already exists");
        }

        try {
            User user = new User();

            user.setRole(request.role);
            user.setStatus("PENDING");   // IMPORTANT

            user.setEmail(request.email);
            user.setPhone(request.phone);

            // Do NOT set password here
            user.setPassword("");

            user.setPersonalDetails(
                    objectMapper.writeValueAsString(request.personalDetails)
            );

            user.setAddressDetails(
                    objectMapper.writeValueAsString(request.addressDetails)
            );

            user.setEducationDetails(
                    objectMapper.writeValueAsString(request.educationDetails)
            );

            user.setWorkDetails(
                    objectMapper.writeValueAsString(request.workDetails)
            );

            user.setDocumentDetails(
                    objectMapper.writeValueAsString(request.documentDetails)
            );

            if(request.cafeDetails != null){
                user.setCafeDetails(
                        objectMapper.writeValueAsString(request.cafeDetails)
                );
            }



            userRepository.save(user);

        } catch (Exception e) {
            throw new RuntimeException("Registration failed");
        }
    }


    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if(user == null) {
            System.out.println("User not found");
            return null;
        }

        if(!"APPROVED".equals(user.getStatus())) {
            System.out.println("User not approved");
            return null;
        }

        boolean match = passwordEncoder.matches(
                request.getPassword().trim(),
                user.getPassword()
        );

        if(!match){
            System.out.println("Password mismatch");
            return null;
        }

        System.out.println("LOGIN SUCCESS → USER ID = " + user.getUserId());

        return user;   // ⭐ VERY IMPORTANT
    }
    public String changePassword(ChangePassword req) {

        User user = userRepository.findByEmail(req.getEmail());

        if (user == null) return "User not found";

        // check old password
        if (!passwordEncoder.matches(req.getOldPassword(), user.getPassword())) {
            return "Old password incorrect";
        }


        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully";
    }



    @PostConstruct
    public void generateAdminPasswordHash() {
        System.out.println("Hashed 2005 = " + passwordEncoder.encode("2005"));
    }

    public String generateAdminPassword(int length) {
        return generatePassword(length);
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

}
