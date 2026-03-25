package com.example.digitalcafe.dto;

import java.util.List;
import java.util.Map;

public class RegisterRequest {
    public String role;
    public String email;
    public String phone;
    public String password;

    public Map<String, Object> personalDetails;
    public Map<String, Object> addressDetails;

    public List<Map<String, Object>> educationDetails;
    public List<Map<String, Object>> workDetails;

    public Map<String, Object> documentDetails;
    public Map<String, Object> cafeDetails;
}
