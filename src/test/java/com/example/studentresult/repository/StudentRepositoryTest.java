package com.example.studentresult.repository;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.studentresult.entity.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    private Student sample() {
        return Student.builder()
                .name("Asha R")
                .email("asha@example.com")
                .rollNumber("CS-101")
                .build();
    }

    @Test
    void savesAndAssignsId() {
        Student saved = studentRepository.save(sample());
        assertThat(saved.getId()).isNotNull();
    }

    @Test
    void existsByEmailReturnsTrueWhenPresent() {
        studentRepository.save(sample());
        assertThat(studentRepository.existsByEmail("asha@example.com")).isTrue();
        assertThat(studentRepository.existsByEmail("missing@example.com")).isFalse();
    }

    @Test
    void existsByRollNumberReturnsTrueWhenPresent() {
        studentRepository.save(sample());
        assertThat(studentRepository.existsByRollNumber("CS-101")).isTrue();
        assertThat(studentRepository.existsByRollNumber("CS-999")).isFalse();
    }
}
