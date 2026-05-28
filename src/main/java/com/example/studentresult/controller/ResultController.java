package com.example.studentresult.controller;

import com.example.studentresult.dto.response.ResultResponse;
import com.example.studentresult.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<ResultResponse> getResult(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResult(studentId));
    }
}
