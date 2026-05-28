package com.example.studentresult.service;

import java.util.List;

import com.example.studentresult.dto.request.StudentRequest;
import com.example.studentresult.dto.response.StudentResponse;

public interface StudentService {

    StudentResponse create(StudentRequest request);

    List<StudentResponse> getAll();

    StudentResponse getById(Long id);

    StudentResponse update(Long id, StudentRequest request);

    void delete(Long id);
}
