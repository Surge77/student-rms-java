package com.example.studentresult.service;

import com.example.studentresult.dto.response.ResultResponse;

public interface ResultService {

    ResultResponse getResult(Long studentId);
}
