package com.example.studentresult.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String register(String username, String role) throws Exception {
        String roleJson = role == null ? "" : ",\"role\":\"" + role + "\"";
        return "{\"username\":\"" + username + "\",\"password\":\"secret123\"" + roleJson + "}";
    }

    private String loginAndGetToken(String username) throws Exception {
        MvcResult result = mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"" + username + "\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return body.get("token").asText();
    }

    @Test
    void protectedEndpointReturns401WithoutToken() throws Exception {
        mockMvc.perform(get("/students"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanCreateStudent() throws Exception {
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(register("admin1", "ADMIN")))
                .andExpect(status().isCreated());

        String token = loginAndGetToken("admin1");

        mockMvc.perform(post("/students").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Asha\",\"email\":\"asha1@e.com\",\"rollNumber\":\"CS-901\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void userCannotCreateStudentButCanRead() throws Exception {
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(register("user1", "USER")))
                .andExpect(status().isCreated());

        String token = loginAndGetToken("user1");

        mockMvc.perform(post("/students").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Asha\",\"email\":\"asha2@e.com\",\"rollNumber\":\"CS-902\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/students").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void loginWithWrongPasswordReturns401() throws Exception {
        mockMvc.perform(post("/auth/register").contentType(MediaType.APPLICATION_JSON)
                        .content(register("admin2", "ADMIN")))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin2\",\"password\":\"wrongpass\"}"))
                .andExpect(status().isUnauthorized());
    }
}
