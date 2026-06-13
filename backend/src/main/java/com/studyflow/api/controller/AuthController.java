package com.studyflow.api.controller;

import com.studyflow.api.model.User;
import com.studyflow.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        if (!isValidEmail(user.getEmail())) {
            response.put("success", false);
            response.put("message", "Invalid email format");
            return response;
        }
        
        User savedUser = userRepository.save(user);
        response.put("success", true);
        response.put("user", savedUser);
        response.put("message", "Registration successful");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        if (!isValidEmail(request.email)) {
            response.put("success", false);
            response.put("message", "Invalid email format");
            return response;
        }

        if (request.password == null || request.password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Password is required");
            return response;
        }
        
        Optional<User> user = userRepository.findByEmail(request.email);
        
        if (user.isPresent()) {
            User foundUser = user.get();
            if (request.password.equals(foundUser.getPassword())) {
                response.put("success", true);
                response.put("user", foundUser);
                response.put("message", "Login successful");
            } else {
                response.put("success", false);
                response.put("message", "Invalid password");
            }
        } else {
            response.put("success", false);
            response.put("message", "User not found");
        }
        
        return response;
    }

    @GetMapping("/user/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    static class LoginRequest {
        public String email;
        public String password;
    }
}
