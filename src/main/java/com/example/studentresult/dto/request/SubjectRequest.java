package com.example.studentresult.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record SubjectRequest(

        @NotBlank(message = "name is required")
        String name,

        @Positive(message = "maxMarks must be positive")
        int maxMarks
) {
}
