package com.example.studentresult.service.impl;

import com.example.studentresult.dto.request.StudentRequest;
import com.example.studentresult.dto.response.StudentResponse;
import com.example.studentresult.entity.Student;
import com.example.studentresult.exception.DuplicateResourceException;
import com.example.studentresult.exception.StudentNotFoundException;
import com.example.studentresult.repository.StudentRepository;
import com.example.studentresult.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    @Transactional
    public StudentResponse create(StudentRequest request) {
        if (studentRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Student already exists with email " + request.email());
        }
        if (studentRepository.existsByRollNumber(request.rollNumber())) {
            throw new DuplicateResourceException("Student already exists with rollNumber " + request.rollNumber());
        }
        Student student = Student.builder()
                .name(request.name())
                .email(request.email())
                .rollNumber(request.rollNumber())
                .build();
        return toResponse(studentRepository.save(student));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponse> getAll(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public StudentResponse update(Long id, StudentRequest request) {
        Student student = findOrThrow(id);
        student.setName(request.name());
        student.setEmail(request.email());
        student.setRollNumber(request.rollNumber());
        return toResponse(studentRepository.save(student));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Student student = findOrThrow(id);
        studentRepository.delete(student);
    }

    private Student findOrThrow(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    private StudentResponse toResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRollNumber()
        );
    }
}
