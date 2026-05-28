package com.example.studentresult.service;

import com.example.studentresult.dto.request.StudentRequest;
import com.example.studentresult.dto.response.StudentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StudentService {

    StudentResponse create(StudentRequest request);

    Page<StudentResponse> getAll(Pageable pageable);

    StudentResponse getById(Long id);

    StudentResponse update(Long id, StudentRequest request);

    void delete(Long id);
}
