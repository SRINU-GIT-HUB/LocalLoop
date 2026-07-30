package com.localloop.service;

import com.localloop.dto.UpdateProfileRequest;
import com.localloop.entity.Role;
import com.localloop.entity.Community;
import com.localloop.repository.CommunityRepository;
import org.springframework.transaction.annotation.Transactional;
import com.localloop.dto.AuthResponse;
import com.localloop.dto.LoginRequest;
import com.localloop.dto.RegisterRequest;
//import com.localloop.entity.Community;
import com.localloop.entity.User;
import com.localloop.repository.UserRepository;
import com.localloop.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;


    @Transactional
    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        // Hardcoded Admin Injection (Part 3)
        if (request.getEmail().equals("srinu1845@gmail.com")
        && userRepository.count() == 0) {

    user.setRole(Role.ADMIN);

    User savedAdmin = userRepository.save(user);

    return new AuthResponse(savedAdmin,
            jwtUtil.generateToken(savedAdmin));
}

        user.setRole(Role.USER);

        if (request.getIsCreatingCommunity()) {
            // 1. Save User first to generate ID
            User savedUser = userRepository.save(user);
            
            // 2. Create Community
            Community comm = new Community();
            comm.setName(request.getCommunityName());
            comm.setCity(request.getCity());
            comm.setState(request.getState());
            comm.setPincode(request.getPincode());
            comm.setLeader(savedUser); // Creator becomes leader
            communityRepository.save(comm);
            
            // 3. Update User with Community and Leader Role
            savedUser.setCommunity(comm);
            savedUser.setRole(Role.LEADER);
            userRepository.save(savedUser);
            
        } else {
            // Join existing community
            Community comm = communityRepository.findById(request.getJoinCommunityId())
                .orElseThrow(() -> new RuntimeException("Community not found"));
            user.setCommunity(comm);
            userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user); // Make sure JwtUtil embeds Role & CommunityId
        return new AuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        String token = jwtUtil.generateToken(user);
        
        return new AuthResponse(user, token);
    }
    public User getProfile(String email){

    return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
}
@Transactional
public User updateProfile(String email, UpdateProfileRequest request) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setFullName(request.getFullName());
    user.setPhoneNumber(request.getPhoneNumber());
    user.setLocation(request.getLocation());

    return userRepository.save(user);
}
}