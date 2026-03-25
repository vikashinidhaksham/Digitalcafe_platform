package com.example.digitalcafe.controller;

import com.example.digitalcafe.entity.User;
import com.example.digitalcafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class ProfileController {

    @Autowired
    private UserRepository userRepository;


    // GET PROFILE
    @GetMapping("/{userId}")
    public User getProfile(@PathVariable int userId){

        return userRepository.findByUserId(userId);

    }


    // UPDATE PROFILE
    @PutMapping("/update/{userId}")
    public User updateProfile(
            @PathVariable int userId,
            @RequestBody User updatedUser){

        User user = userRepository.findByUserId(userId);

        user.setPersonalDetails(updatedUser.getPersonalDetails());
        user.setAddressDetails(updatedUser.getAddressDetails());
        user.setEducationDetails(updatedUser.getEducationDetails());
        user.setWorkDetails(updatedUser.getWorkDetails());
        user.setDocumentDetails(updatedUser.getDocumentDetails());
        user.setPhone(updatedUser.getPhone());

        return userRepository.save(user);
    }

}