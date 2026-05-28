package com.example.studentresult.exception;

public class MarkAlreadyExistsException extends RuntimeException {

    public MarkAlreadyExistsException(Long studentId, Long subjectId) {
        super("Mark already exists for student " + studentId + " and subject " + subjectId);
    }
}
