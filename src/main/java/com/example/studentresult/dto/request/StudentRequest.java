package com.example.studentresult.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record StudentRequest(

        @NotBlank(message = "name is required")
        String name,

        @NotBlank(message = "email is required")
        @Email(message = "email must be a valid format")
        String email,

        @NotBlank(message = "rollNumber is required")
        String rollNumber
) {
}
