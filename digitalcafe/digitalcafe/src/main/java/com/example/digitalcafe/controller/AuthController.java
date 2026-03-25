package com.example.digitalcafe.controller;

import com.example.digitalcafe.dto.RegisterRequest;
import com.example.digitalcafe.dto.LoginRequest;
import com.example.digitalcafe.dto.ChangePassword;
import com.example.digitalcafe.service.AuthService;
import com.example.digitalcafe.repository.UserRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.digitalcafe.entity.User;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public Map<String, String> register(@RequestBody RegisterRequest request) {

        authService.register(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully.");
        return response;
    }
    @PostMapping("/login")
    public Map<String,Object> login(@RequestBody LoginRequest request){

        User user = authService.login(request);

        Map<String,Object> response = new HashMap<>();

        if(user != null){

            response.put("userId", user.getUserId());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("status", user.getStatus());
            response.put("cafeId", user.getCafeId());

        }else{
            response.put("message","Invalid login");
        }

        return response;
    }

   /* @PostMapping("/login")
    public Map<String,Object> login(@RequestBody LoginRequest request){

        User user = authService.login(request);

        Map<String,Object> response = new HashMap<>();

        if(user != null){
            response.put("userId", user.getUserId());
            response.put("role", user.getRole());
        }else{
            response.put("message","Invalid login");
        }

        return response;
    }*/

    @PostMapping("/change-password")
    public Map<String,String> changePassword(@RequestBody ChangePassword req){

        String msg = authService.changePassword(req);

        Map<String,String> res = new HashMap<>();
        res.put("message", msg);

        return res;
    }


}