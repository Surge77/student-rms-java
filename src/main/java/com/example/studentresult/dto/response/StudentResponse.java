package com.example.studentresult.dto.response;

public record StudentResponse(
        Long id,
        String name,
        String email,
        String rollNumber
) {
}
