package com.example.studentresult.dto.response;

import com.example.studentresult.entity.Role;

public record AuthResponse(
        String token,
        String username,
        Role role,
        long expiresIn
) {
}
