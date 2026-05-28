package com.example.studentresult.repository;

import java.util.List;

import com.example.studentresult.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {

    List<Mark> findByStudentId(Long studentId);

    boolean existsByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
