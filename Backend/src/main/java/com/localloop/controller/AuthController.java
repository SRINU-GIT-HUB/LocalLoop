package com.localloop.controller;

//import com.localloop.dto.AuthResponse;
import com.localloop.dto.LoginRequest;
import com.localloop.dto.RegisterRequest;
import com.localloop.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.localloop.dto.UpdateProfileRequest;
import java.security.Principal;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.localloop.service.UserService;

import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
        
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/api/provider/apply")
    public ResponseEntity<?> applyAsProvider(@RequestBody Map<String, String> payload, Principal principal) {
        userService.applyForProvider(principal.getName(), payload.get("category"), payload.get("description"), Integer.parseInt(payload.get("experience")));
        return ResponseEntity.ok().build();
    }
    @GetMapping("/profile")
public ResponseEntity<?> getProfile(Principal principal) {

    return ResponseEntity.ok(
            authService.getProfile(principal.getName()));
}

@PutMapping("/profile")
public ResponseEntity<?> updateProfile(
        Principal principal,
        @RequestBody UpdateProfileRequest request) {

    return ResponseEntity.ok(
            authService.updateProfile(principal.getName(), request));
}
@GetMapping("/test")
public String test() {
    return "Backend is working!";
}
}