package com.example.studentresult.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.example.studentresult.dto.request.MarkRequest;
import com.example.studentresult.dto.request.MarkUpdateRequest;
import com.example.studentresult.dto.response.MarkResponse;
import com.example.studentresult.entity.Grade;
import com.example.studentresult.entity.Mark;
import com.example.studentresult.entity.Student;
import com.example.studentresult.entity.Subject;
import com.example.studentresult.exception.MarkAlreadyExistsException;
import com.example.studentresult.exception.MarkNotFoundException;
import com.example.studentresult.exception.StudentNotFoundException;
import com.example.studentresult.exception.SubjectNotFoundException;
import com.example.studentresult.repository.MarkRepository;
import com.example.studentresult.repository.StudentRepository;
import com.example.studentresult.repository.SubjectRepository;
import com.example.studentresult.service.GradeCalculator;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MarkServiceImplTest {

    @Mock private MarkRepository markRepository;
    @Mock private StudentRepository studentRepository;
    @Mock private SubjectRepository subjectRepository;
    @Mock private GradeCalculator gradeCalculator;

    @InjectMocks
    private MarkServiceImpl markService;

    private Student student() {
        return Student.builder().id(1L).name("Asha").email("a@e.com").rollNumber("CS-1").build();
    }

    private Subject subject() {
        return Subject.builder().id(2L).name("Mathematics").maxMarks(100).build();
    }

    private final MarkRequest request = new MarkRequest(1L, 2L, 82);

    @Test
    void assignComputesGradeAndReturnsResponse() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student()));
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(subject()));
        when(markRepository.existsByStudentIdAndSubjectId(1L, 2L)).thenReturn(false);
        when(gradeCalculator.calculate(82, 100)).thenReturn(Grade.A);
        when(markRepository.save(any(Mark.class))).thenAnswer(inv -> {
            Mark m = inv.getArgument(0);
            m.setId(10L);
            return m;
        });

        MarkResponse res = markService.assign(request);

        assertThat(res.id()).isEqualTo(10L);
        assertThat(res.subjectName()).isEqualTo("Mathematics");
        assertThat(res.maxMarks()).isEqualTo(100);
        assertThat(res.grade()).isEqualTo(Grade.A);
    }

    @Test
    void assignThrowsWhenStudentMissing() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> markService.assign(request))
                .isInstanceOf(StudentNotFoundException.class);
    }

    @Test
    void assignThrowsWhenSubjectMissing() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student()));
        when(subjectRepository.findById(2L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> markService.assign(request))
                .isInstanceOf(SubjectNotFoundException.class);
    }

    @Test
    void assignThrowsWhenDuplicate() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student()));
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(subject()));
        when(markRepository.existsByStudentIdAndSubjectId(1L, 2L)).thenReturn(true);

        assertThatThrownBy(() -> markService.assign(request))
                .isInstanceOf(MarkAlreadyExistsException.class);
        verify(markRepository, never()).save(any());
    }

    @Test
    void assignThrowsWhenMarksExceedMax() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student()));
        when(subjectRepository.findById(2L)).thenReturn(Optional.of(subject()));
        when(markRepository.existsByStudentIdAndSubjectId(1L, 2L)).thenReturn(false);

        assertThatThrownBy(() -> markService.assign(new MarkRequest(1L, 2L, 150)))
                .isInstanceOf(IllegalArgumentException.class);
        verify(markRepository, never()).save(any());
    }

    @Test
    void getByStudentThrowsWhenStudentMissing() {
        when(studentRepository.existsById(9L)).thenReturn(false);

        assertThatThrownBy(() -> markService.getByStudent(9L))
                .isInstanceOf(StudentNotFoundException.class);
    }

    @Test
    void updateRecomputesGrade() {
        Mark existing = Mark.builder().id(10L).student(student()).subject(subject())
                .marksObtained(82).grade(Grade.A).build();
        when(markRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(gradeCalculator.calculate(30, 100)).thenReturn(Grade.F);
        when(markRepository.save(any(Mark.class))).thenAnswer(inv -> inv.getArgument(0));

        MarkResponse res = markService.update(10L, new MarkUpdateRequest(30));

        assertThat(res.marksObtained()).isEqualTo(30);
        assertThat(res.grade()).isEqualTo(Grade.F);
    }

    @Test
    void updateThrowsWhenMarkMissing() {
        when(markRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> markService.update(404L, new MarkUpdateRequest(50)))
                .isInstanceOf(MarkNotFoundException.class);
    }

    @Test
    void updateThrowsWhenMarksExceedMax() {
        Mark existing = Mark.builder().id(10L).student(student()).subject(subject())
                .marksObtained(82).grade(Grade.A).build();
        when(markRepository.findById(10L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> markService.update(10L, new MarkUpdateRequest(150)))
                .isInstanceOf(IllegalArgumentException.class);
        verify(markRepository, never()).save(any());
    }
}
