package com.example.studentresult.service;

import java.util.List;

import com.example.studentresult.dto.request.MarkRequest;
import com.example.studentresult.dto.request.MarkUpdateRequest;
import com.example.studentresult.dto.response.MarkResponse;

public interface MarkService {

    MarkResponse assign(MarkRequest request);

    MarkResponse update(Long markId, MarkUpdateRequest request);

    List<MarkResponse> getByStudent(Long studentId);
}
