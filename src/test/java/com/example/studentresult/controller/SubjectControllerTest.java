package com.example.studentresult.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.studentresult.dto.response.SubjectResponse;
import com.example.studentresult.service.SubjectService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(SubjectController.class)
@AutoConfigureMockMvc(addFilters = false)
class SubjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubjectService subjectService;

    @Test
    void createReturns201() throws Exception {
        when(subjectService.create(any())).thenReturn(new SubjectResponse(1L, "Mathematics", 100));

        mockMvc.perform(post("/subjects").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Mathematics\",\"maxMarks\":100}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.maxMarks").value(100));
    }

    @Test
    void createReturns400WhenMaxMarksNotPositive() throws Exception {
        mockMvc.perform(post("/subjects").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Mathematics\",\"maxMarks\":0}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createReturns400WhenNameBlank() throws Exception {
        mockMvc.perform(post("/subjects").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"maxMarks\":100}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllReturns200() throws Exception {
        when(subjectService.getAll()).thenReturn(java.util.List.of(new SubjectResponse(1L, "Mathematics", 100)));

        mockMvc.perform(get("/subjects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Mathematics"));
    }
}
