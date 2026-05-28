package com.example.studentresult.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class JwtUtilTest {

    private static final String SECRET = "test-secret-test-secret-test-secret-0123456789";

    private final JwtUtil jwtUtil = new JwtUtil(SECRET, 3_600_000L);

    @Test
    void generatesTokenCarryingUsernameAndRole() {
        String token = jwtUtil.generateToken("admin", "ADMIN");

        assertThat(jwtUtil.extractUsername(token)).isEqualTo("admin");
        assertThat(jwtUtil.extractRole(token)).isEqualTo("ADMIN");
    }

    @Test
    void validWhenUsernameMatchesAndNotExpired() {
        String token = jwtUtil.generateToken("admin", "ADMIN");

        assertThat(jwtUtil.isTokenValid(token, "admin")).isTrue();
        assertThat(jwtUtil.isTokenValid(token, "someoneElse")).isFalse();
    }

    @Test
    void invalidWhenExpired() {
        JwtUtil expiring = new JwtUtil(SECRET, -1_000L);
        String token = expiring.generateToken("admin", "ADMIN");

        assertThat(expiring.isTokenValid(token, "admin")).isFalse();
    }

    @Test
    void invalidWhenMalformed() {
        assertThat(jwtUtil.isTokenValid("not-a-real-token", "admin")).isFalse();
    }
}
