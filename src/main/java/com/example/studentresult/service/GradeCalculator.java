package com.example.studentresult.service;

import com.example.studentresult.entity.Grade;
import org.springframework.stereotype.Component;

@Component
public class GradeCalculator {

    public Grade calculate(int marksObtained, int maxMarks) {
        if (maxMarks <= 0) {
            throw new IllegalArgumentException("maxMarks must be greater than 0");
        }
        double percentage = (double) marksObtained / maxMarks * 100;
        if (percentage >= 90) return Grade.A_PLUS;
        if (percentage >= 75) return Grade.A;
        if (percentage >= 60) return Grade.B;
        if (percentage >= 50) return Grade.C;
        if (percentage >= 40) return Grade.D;
        return Grade.F;
    }
}
