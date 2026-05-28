package com.example.studentresult.dto.response;

public record ErrorResponse(
        int status,
        String message,
        String timestamp
) {
}
