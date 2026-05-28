package com.example.studentresult.service;

import java.util.List;

import com.example.studentresult.dto.request.SubjectRequest;
import com.example.studentresult.dto.response.SubjectResponse;

public interface SubjectService {

    SubjectResponse create(SubjectRequest request);

    List<SubjectResponse> getAll();

    SubjectResponse getById(Long id);

    SubjectResponse update(Long id, SubjectRequest request);

    void delete(Long id);
}
