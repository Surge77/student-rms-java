package com.example.studentresult.dto.request;

import jakarta.validation.constraints.PositiveOrZero;

public record MarkUpdateRequest(

        @PositiveOrZero(message = "marksObtained cannot be negative")
        int marksObtained
) {
}
