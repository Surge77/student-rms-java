package com.example.studentresult.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.example.studentresult.dto.request.LoginRequest;
import com.example.studentresult.dto.request.RegisterRequest;
import com.example.studentresult.dto.response.AuthResponse;
import com.example.studentresult.dto.response.RegisterResponse;
import com.example.studentresult.entity.Role;
import com.example.studentresult.entity.User;
import com.example.studentresult.exception.DuplicateResourceException;
import com.example.studentresult.repository.UserRepository;
import com.example.studentresult.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void registerDefaultsToUserRoleAndHashesPassword() {
        RegisterRequest request = new RegisterRequest("alice", "secret123", null);
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(1L);
            return u;
        });

        RegisterResponse res = authService.register(request);

        assertThat(res.username()).isEqualTo("alice");
        assertThat(res.role()).isEqualTo(Role.USER);
        verify(passwordEncoder).encode("secret123");
    }

    @Test
    void registerThrowsWhenUsernameTaken() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(new RegisterRequest("alice", "secret123", null)))
                .isInstanceOf(DuplicateResourceException.class);
        verify(userRepository, never()).save(any());
    }

    @Test
    void loginReturnsTokenOnSuccess() {
        User user = User.builder().id(1L).username("admin").password("hash").role(Role.ADMIN).build();
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken("admin", "ADMIN")).thenReturn("jwt-token");
        when(jwtUtil.getExpirationSeconds()).thenReturn(3600L);

        AuthResponse res = authService.login(new LoginRequest("admin", "secret123"));

        assertThat(res.token()).isEqualTo("jwt-token");
        assertThat(res.role()).isEqualTo(Role.ADMIN);
        assertThat(res.expiresIn()).isEqualTo(3600L);
    }
}
