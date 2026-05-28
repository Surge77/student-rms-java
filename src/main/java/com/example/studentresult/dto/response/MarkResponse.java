package com.example.studentresult.dto.response;

import com.example.studentresult.entity.Grade;

public record MarkResponse(
        Long id,
        Long studentId,
        String subjectName,
        int marksObtained,
        int maxMarks,
        Grade grade
) {
}
