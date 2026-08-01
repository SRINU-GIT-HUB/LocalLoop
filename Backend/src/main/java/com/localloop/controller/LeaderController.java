package com.localloop.controller;

import com.localloop.entity.User;
import com.localloop.service.LeaderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/leader")
@PreAuthorize("hasAuthority('LEADER')")
@RequiredArgsConstructor
public class LeaderController {

    private final LeaderService leaderService;

    @GetMapping("/provider-requests/pending")
    public ResponseEntity<List<User>> getPendingRequests(Principal principal) {
        return ResponseEntity.ok(leaderService.getPendingProvidersForLeader(principal.getName()));
    }

    @PutMapping("/provider-requests/{id}/approve")
    public ResponseEntity<?> approveProvider(@PathVariable Long id, Principal principal) {
        leaderService.approveProvider(id, principal.getName());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/provider-requests/{id}/reject")
    public ResponseEntity<?> rejectProvider(@PathVariable Long id, @RequestBody String reason, Principal principal) {
        leaderService.rejectProvider(id, reason, principal.getName());
        return ResponseEntity.ok().build();
    }
}