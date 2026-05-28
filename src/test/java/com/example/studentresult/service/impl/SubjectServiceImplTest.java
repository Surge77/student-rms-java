package com.example.studentresult.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.example.studentresult.dto.request.SubjectRequest;
import com.example.studentresult.dto.response.SubjectResponse;
import com.example.studentresult.entity.Subject;
import com.example.studentresult.exception.DuplicateResourceException;
import com.example.studentresult.exception.SubjectNotFoundException;
import com.example.studentresult.repository.SubjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SubjectServiceImplTest {

    @Mock
    private SubjectRepository subjectRepository;

    @InjectMocks
    private SubjectServiceImpl subjectService;

    private final SubjectRequest request = new SubjectRequest("Mathematics", 100);

    private Subject stored() {
        return Subject.builder().id(1L).name("Mathematics").maxMarks(100).build();
    }

    @Test
    void createReturnsResponseWhenUnique() {
        when(subjectRepository.existsByName("Mathematics")).thenReturn(false);
        when(subjectRepository.save(any(Subject.class))).thenReturn(stored());

        SubjectResponse res = subjectService.create(request);

        assertThat(res.id()).isEqualTo(1L);
        assertThat(res.maxMarks()).isEqualTo(100);
    }

    @Test
    void createThrowsWhenNameDuplicate() {
        when(subjectRepository.existsByName("Mathematics")).thenReturn(true);

        assertThatThrownBy(() -> subjectService.create(request))
                .isInstanceOf(DuplicateResourceException.class);
        verify(subjectRepository, never()).save(any());
    }

    @Test
    void getByIdThrowsWhenMissing() {
        when(subjectRepository.findById(7L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.getById(7L))
                .isInstanceOf(SubjectNotFoundException.class);
    }

    @Test
    void updateChangesFields() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(stored()));
        when(subjectRepository.save(any(Subject.class))).thenAnswer(inv -> inv.getArgument(0));

        SubjectResponse res = subjectService.update(1L, new SubjectRequest("Physics", 50));

        assertThat(res.name()).isEqualTo("Physics");
        assertThat(res.maxMarks()).isEqualTo(50);
    }
}
