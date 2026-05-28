package com.example.studentresult.service;

import com.example.studentresult.dto.request.LoginRequest;
import com.example.studentresult.dto.request.RegisterRequest;
import com.example.studentresult.dto.response.AuthResponse;
import com.example.studentresult.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
