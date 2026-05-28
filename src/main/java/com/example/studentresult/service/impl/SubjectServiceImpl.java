package com.example.studentresult.service.impl;

import com.example.studentresult.dto.request.SubjectRequest;
import com.example.studentresult.dto.response.SubjectResponse;
import com.example.studentresult.entity.Subject;
import com.example.studentresult.exception.DuplicateResourceException;
import com.example.studentresult.exception.SubjectNotFoundException;
import com.example.studentresult.repository.SubjectRepository;
import com.example.studentresult.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    @Override
    @Transactional
    public SubjectResponse create(SubjectRequest request) {
        if (subjectRepository.existsByName(request.name())) {
            throw new DuplicateResourceException("Subject already exists with name " + request.name());
        }
        Subject subject = Subject.builder()
                .name(request.name())
                .maxMarks(request.maxMarks())
                .build();
        return toResponse(subjectRepository.save(subject));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubjectResponse> getAll(Pageable pageable) {
        return subjectRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    @Transactional
    public SubjectResponse update(Long id, SubjectRequest request) {
        Subject subject = findOrThrow(id);
        subject.setName(request.name());
        subject.setMaxMarks(request.maxMarks());
        return toResponse(subjectRepository.save(subject));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Subject subject = findOrThrow(id);
        subjectRepository.delete(subject);
    }

    private Subject findOrThrow(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new SubjectNotFoundException(id));
    }

    private SubjectResponse toResponse(Subject subject) {
        return new SubjectResponse(subject.getId(), subject.getName(), subject.getMaxMarks());
    }
}
