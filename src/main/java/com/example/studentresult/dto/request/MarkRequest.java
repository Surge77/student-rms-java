package com.example.studentresult.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record MarkRequest(

        @NotNull(message = "studentId is required")
        Long studentId,

        @NotNull(message = "subjectId is required")
        Long subjectId,

        @PositiveOrZero(message = "marksObtained cannot be negative")
        int marksObtained
) {
}
