package com.localloop.controller;

import com.localloop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "*") // Ensures React is allowed to talk to this endpoint
@RequiredArgsConstructor
public class ProviderController {

    private final UserService userService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyAsProvider(@RequestBody Map<String, String> payload, Principal principal) {
        userService.applyForProvider(
            principal.getName(), 
            payload.get("category"), 
            payload.get("description"), 
            Integer.parseInt(payload.get("experience"))
        );
        return ResponseEntity.ok().build();
    }
}