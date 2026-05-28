package com.example.studentresult.service.impl;

import java.util.List;

import com.example.studentresult.dto.request.MarkRequest;
import com.example.studentresult.dto.request.MarkUpdateRequest;
import com.example.studentresult.dto.response.MarkResponse;
import com.example.studentresult.entity.Mark;
import com.example.studentresult.entity.Student;
import com.example.studentresult.entity.Subject;
import com.example.studentresult.exception.MarkAlreadyExistsException;
import com.example.studentresult.exception.MarkNotFoundException;
import com.example.studentresult.exception.StudentNotFoundException;
import com.example.studentresult.exception.SubjectNotFoundException;
import com.example.studentresult.repository.MarkRepository;
import com.example.studentresult.repository.StudentRepository;
import com.example.studentresult.repository.SubjectRepository;
import com.example.studentresult.service.GradeCalculator;
import com.example.studentresult.service.MarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MarkServiceImpl implements MarkService {

    private final MarkRepository markRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final GradeCalculator gradeCalculator;

    @Override
    @Transactional
    public MarkResponse assign(MarkRequest request) {
        Student student = studentRepository.findById(request.studentId())
                .orElseThrow(() -> new StudentNotFoundException(request.studentId()));
        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new SubjectNotFoundException(request.subjectId()));

        if (markRepository.existsByStudentIdAndSubjectId(student.getId(), subject.getId())) {
            throw new MarkAlreadyExistsException(student.getId(), subject.getId());
        }
        if (request.marksObtained() < 0 || request.marksObtained() > subject.getMaxMarks()) {
            throw new IllegalArgumentException(
                    "marksObtained must be between 0 and " + subject.getMaxMarks());
        }

        Mark mark = Mark.builder()
                .student(student)
                .subject(subject)
                .marksObtained(request.marksObtained())
                .grade(gradeCalculator.calculate(request.marksObtained(), subject.getMaxMarks()))
                .build();

        return toResponse(markRepository.save(mark));
    }

    @Override
    @Transactional
    public MarkResponse update(Long markId, MarkUpdateRequest request) {
        Mark mark = markRepository.findById(markId)
                .orElseThrow(() -> new MarkNotFoundException(markId));

        int maxMarks = mark.getSubject().getMaxMarks();
        if (request.marksObtained() < 0 || request.marksObtained() > maxMarks) {
            throw new IllegalArgumentException("marksObtained must be between 0 and " + maxMarks);
        }

        mark.setMarksObtained(request.marksObtained());
        mark.setGrade(gradeCalculator.calculate(request.marksObtained(), maxMarks));
        return toResponse(markRepository.save(mark));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MarkResponse> getByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException(studentId);
        }
        return markRepository.findByStudentId(studentId).stream()
                .map(this::toResponse)
                .toList();
    }

    private MarkResponse toResponse(Mark mark) {
        return new MarkResponse(
                mark.getId(),
                mark.getStudent().getId(),
                mark.getSubject().getName(),
                mark.getMarksObtained(),
                mark.getSubject().getMaxMarks(),
                mark.getGrade()
        );
    }
}
