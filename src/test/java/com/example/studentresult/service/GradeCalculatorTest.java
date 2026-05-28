package com.example.studentresult.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.studentresult.entity.Grade;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class GradeCalculatorTest {

    private final GradeCalculator calculator = new GradeCalculator();

    @ParameterizedTest(name = "{0}/100 -> {1}")
    @CsvSource({
            "100, A_PLUS",
            "90,  A_PLUS",
            "89,  A",
            "75,  A",
            "74,  B",
            "60,  B",
            "59,  C",
            "50,  C",
            "49,  D",
            "40,  D",
            "39,  F",
            "0,   F"
    })
    void mapsPercentageToGradeAtBoundaries(int marks, Grade expected) {
        assertThat(calculator.calculate(marks, 100)).isEqualTo(expected);
    }

    @Test
    void usesPercentageNotRawMarks() {
        // 40 of 50 = 80% -> A
        assertThat(calculator.calculate(40, 50)).isEqualTo(Grade.A);
        // 20 of 50 = 40% -> D
        assertThat(calculator.calculate(20, 50)).isEqualTo(Grade.D);
    }

    @Test
    void throwsWhenMaxMarksNotPositive() {
        assertThatThrownBy(() -> calculator.calculate(10, 0))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
