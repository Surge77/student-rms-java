package com.example.studentresult.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.studentresult.dto.response.StudentResponse;
import com.example.studentresult.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(StudentController.class)
@AutoConfigureMockMvc(addFilters = false)
class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StudentService studentService;

    @Test
    void createReturns201() throws Exception {
        when(studentService.create(any())).thenReturn(new StudentResponse(1L, "Asha R", "asha@example.com", "CS-101"));

        String body = objectMapper.writeValueAsString(
                new java.util.HashMap<>() {{
                    put("name", "Asha R");
                    put("email", "asha@example.com");
                    put("rollNumber", "CS-101");
                }});

        mockMvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("asha@example.com"));
    }

    @Test
    void createReturns400WhenEmailInvalid() throws Exception {
        String body = "{\"name\":\"Asha\",\"email\":\"not-an-email\",\"rollNumber\":\"CS-101\"}";

        mockMvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createReturns400WhenNameBlank() throws Exception {
        String body = "{\"name\":\"\",\"email\":\"asha@example.com\",\"rollNumber\":\"CS-101\"}";

        mockMvc.perform(post("/students").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllReturns200() throws Exception {
        when(studentService.getAll()).thenReturn(java.util.List.of(
                new StudentResponse(1L, "Asha R", "asha@example.com", "CS-101")));

        mockMvc.perform(get("/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rollNumber").value("CS-101"));
    }
}
