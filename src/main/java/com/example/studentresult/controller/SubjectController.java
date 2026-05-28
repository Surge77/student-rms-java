package com.example.studentresult.controller;

import java.util.List;

import com.example.studentresult.dto.request.SubjectRequest;
import com.example.studentresult.dto.response.SubjectResponse;
import com.example.studentresult.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public ResponseEntity<SubjectResponse> create(@Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getAll() {
        return ResponseEntity.ok(subjectService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(subjectService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody SubjectRequest request) {
        return ResponseEntity.ok(subjectService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        subjectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
