package com.example.studentresult.service.impl;

import java.util.List;

import com.example.studentresult.dto.response.ResultResponse;
import com.example.studentresult.dto.response.ResultResponse.SubjectResult;
import com.example.studentresult.dto.response.ResultStatus;
import com.example.studentresult.entity.Mark;
import com.example.studentresult.entity.Student;
import com.example.studentresult.exception.StudentNotFoundException;
import com.example.studentresult.repository.MarkRepository;
import com.example.studentresult.repository.StudentRepository;
import com.example.studentresult.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private static final double PASS_THRESHOLD_PERCENT = 40.0;

    private final StudentRepository studentRepository;
    private final MarkRepository markRepository;

    @Override
    @Transactional(readOnly = true)
    public ResultResponse getResult(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        List<Mark> marks = markRepository.findByStudentId(studentId);

        if (marks.isEmpty()) {
            return new ResultResponse(
                    student.getId(), student.getName(), student.getRollNumber(),
                    List.of(), 0, 0, 0.0, ResultStatus.NO_RESULT);
        }

        List<SubjectResult> subjects = marks.stream()
                .map(m -> new SubjectResult(
                        m.getSubject().getName(),
                        m.getSubject().getMaxMarks(),
                        m.getMarksObtained(),
                        m.getGrade()))
                .toList();

        int totalObtained = marks.stream().mapToInt(Mark::getMarksObtained).sum();
        int totalMax = marks.stream().mapToInt(m -> m.getSubject().getMaxMarks()).sum();
        double overallPercentage = round1(totalObtained * 100.0 / totalMax);

        boolean passedAll = marks.stream().allMatch(this::subjectPassed);
        ResultStatus status = passedAll ? ResultStatus.PASS : ResultStatus.FAIL;

        return new ResultResponse(
                student.getId(), student.getName(), student.getRollNumber(),
                subjects, totalObtained, totalMax, overallPercentage, status);
    }

    private boolean subjectPassed(Mark mark) {
        double pct = mark.getMarksObtained() * 100.0 / mark.getSubject().getMaxMarks();
        return pct >= PASS_THRESHOLD_PERCENT;
    }

    private double round1(double value) {
        return Math.round(value * 10) / 10.0;
    }
}
