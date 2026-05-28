package com.example.studentresult.dto.response;

import java.util.List;

import com.example.studentresult.entity.Grade;

public record ResultResponse(
        Long studentId,
        String studentName,
        String rollNumber,
        List<SubjectResult> subjects,
        int totalMarksObtained,
        int totalMaxMarks,
        double overallPercentage,
        ResultStatus status
) {

    public record SubjectResult(
            String subjectName,
            int maxMarks,
            int marksObtained,
            Grade grade
    ) {
    }
}
