package com.example.studentresult.service.impl;

import com.example.studentresult.dto.request.LoginRequest;
import com.example.studentresult.dto.request.RegisterRequest;
import com.example.studentresult.dto.response.AuthResponse;
import com.example.studentresult.dto.response.RegisterResponse;
import com.example.studentresult.entity.Role;
import com.example.studentresult.entity.User;
import com.example.studentresult.exception.DuplicateResourceException;
import com.example.studentresult.repository.UserRepository;
import com.example.studentresult.security.JwtUtil;
import com.example.studentresult.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already taken: " + request.username());
        }
        Role role = request.role() != null ? request.role() : Role.USER;
        User user = User.builder()
                .username(request.username())
                .password(passwordEncoder.encode(request.password()))
                .role(role)
                .build();
        User saved = userRepository.save(user);
        return new RegisterResponse(saved.getId(), saved.getUsername(), saved.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Throws AuthenticationException (-> 401) if credentials are wrong.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole(), jwtUtil.getExpirationSeconds());
    }
}
