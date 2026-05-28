package com.example.studentresult.service;

import com.example.studentresult.dto.request.SubjectRequest;
import com.example.studentresult.dto.response.SubjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SubjectService {

    SubjectResponse create(SubjectRequest request);

    Page<SubjectResponse> getAll(Pageable pageable);

    SubjectResponse getById(Long id);

    SubjectResponse update(Long id, SubjectRequest request);

    void delete(Long id);
}
