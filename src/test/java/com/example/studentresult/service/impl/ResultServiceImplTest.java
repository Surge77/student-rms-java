package com.example.studentresult.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import com.example.studentresult.dto.response.ResultResponse;
import com.example.studentresult.dto.response.ResultStatus;
import com.example.studentresult.entity.Grade;
import com.example.studentresult.entity.Mark;
import com.example.studentresult.entity.Student;
import com.example.studentresult.entity.Subject;
import com.example.studentresult.exception.StudentNotFoundException;
import com.example.studentresult.repository.MarkRepository;
import com.example.studentresult.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ResultServiceImplTest {

    @Mock private StudentRepository studentRepository;
    @Mock private MarkRepository markRepository;

    @InjectMocks
    private ResultServiceImpl resultService;

    private Student student() {
        return Student.builder().id(1L).name("Asha").email("a@e.com").rollNumber("CS-1").build();
    }

    private Mark mark(String subjectName, int max, int obtained, Grade grade) {
        Subject subject = Subject.builder().id(1L).name(subjectName).maxMarks(max).build();
        return Mark.builder().id(1L).subject(subject).student(student())
                .marksObtained(obtained).grade(grade).build();
    }

    @Test
    void throwsWhenStudentMissing() {
        when(studentRepository.findById(9L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resultService.getResult(9L))
                .isInstanceOf(StudentNotFoundException.class);
    }

    @Test
    void returnsNoResultWhenNoMarks() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student()));
        when(markRepository.findByStudentId(1L)).thenReturn(List.of());

        ResultResponse res = resultService.getResult(1L);

        assertThat(res.status()).isEqualTo(ResultStatus.NO_RESULT);
        assertThat(res.subjects()).isEmpty();
        assertThat(res.totalMaxMarks()).isZero();
    }

    @Test
    void passWhenEverySubjectAtLeast40Percent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student()));
        when(markRepository.findByStudentId(1L)).thenReturn(List.of(
                mark("Maths", 100, 82, Grade.A),
                mark("Physics", 100, 40, Grade.D)));

        ResultResponse res = resultService.getResult(1L);

        assertThat(res.status()).isEqualTo(ResultStatus.PASS);
        assertThat(res.totalMarksObtained()).isEqualTo(122);
        assertThat(res.totalMaxMarks()).isEqualTo(200);
        assertThat(res.overallPercentage()).isEqualTo(61.0);
    }

    @Test
    void failWhenAnySubjectBelow40Percent() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student()));
        when(markRepository.findByStudentId(1L)).thenReturn(List.of(
                mark("Maths", 100, 82, Grade.A),
                mark("Physics", 100, 35, Grade.F)));

        ResultResponse res = resultService.getResult(1L);

        assertThat(res.status()).isEqualTo(ResultStatus.FAIL);
        assertThat(res.overallPercentage()).isEqualTo(58.5);
    }
}
