package com.example.studentresult.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.example.studentresult.dto.request.StudentRequest;
import com.example.studentresult.dto.response.StudentResponse;
import com.example.studentresult.entity.Student;
import com.example.studentresult.exception.DuplicateResourceException;
import com.example.studentresult.exception.StudentNotFoundException;
import com.example.studentresult.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StudentServiceImplTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private final StudentRequest request = new StudentRequest("Asha R", "asha@example.com", "CS-101");

    private Student stored() {
        return Student.builder().id(1L).name("Asha R").email("asha@example.com").rollNumber("CS-101").build();
    }

    @Test
    void createReturnsResponseWhenUnique() {
        when(studentRepository.existsByEmail("asha@example.com")).thenReturn(false);
        when(studentRepository.existsByRollNumber("CS-101")).thenReturn(false);
        when(studentRepository.save(any(Student.class))).thenReturn(stored());

        StudentResponse res = studentService.create(request);

        assertThat(res.id()).isEqualTo(1L);
        assertThat(res.email()).isEqualTo("asha@example.com");
    }

    @Test
    void createThrowsWhenEmailDuplicate() {
        when(studentRepository.existsByEmail("asha@example.com")).thenReturn(true);

        assertThatThrownBy(() -> studentService.create(request))
                .isInstanceOf(DuplicateResourceException.class);
        verify(studentRepository, never()).save(any());
    }

    @Test
    void getByIdThrowsWhenMissing() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getById(99L))
                .isInstanceOf(StudentNotFoundException.class);
    }

    @Test
    void updateChangesFieldsOnExisting() {
        Student existing = stored();
        when(studentRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(studentRepository.save(any(Student.class))).thenAnswer(inv -> inv.getArgument(0));

        StudentResponse res = studentService.update(1L, new StudentRequest("New Name", "new@example.com", "CS-200"));

        assertThat(res.name()).isEqualTo("New Name");
        assertThat(res.rollNumber()).isEqualTo("CS-200");
    }

    @Test
    void deleteThrowsWhenMissing() {
        when(studentRepository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.delete(5L))
                .isInstanceOf(StudentNotFoundException.class);
    }
}
