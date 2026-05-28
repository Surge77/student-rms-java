package com.example.studentresult.dto.response;

import com.example.studentresult.entity.Role;

public record RegisterResponse(
        Long id,
        String username,
        Role role
) {
}
