package com.example.studentresult.controller;

import java.util.List;

import com.example.studentresult.dto.request.MarkRequest;
import com.example.studentresult.dto.response.MarkResponse;
import com.example.studentresult.service.MarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/marks")
@RequiredArgsConstructor
public class MarkController {

    private final MarkService markService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MarkResponse> assign(@Valid @RequestBody MarkRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(markService.assign(request));
    }

    @GetMapping("/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<List<MarkResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(markService.getByStudent(studentId));
    }
}
