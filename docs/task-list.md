# Task List — SRMS

Check off as you go. Each phase = a commit (or a small branch). Details in `phase-plan.md`.

## Phase 1 — Setup ✅ (scaffolded)
- [x] pom.xml with all deps
- [x] application-example.properties template
- [x] StudentResultApplication main class
- [x] .gitignore + Maven wrapper
- [ ] Create MySQL DB `srms`
- [ ] Copy → application.properties, fill credentials + JWT secret
- [ ] `./mvnw spring-boot:run` boots clean

## Phase 2 — Entities & Repositories ✅ (code done; verify tables after DB up)
- [x] Student, Subject, Mark entities
- [x] User, Role enum, Grade enum
- [x] 4 repositories with custom finders
- [ ] Tables auto-created in MySQL with constraints (run app once DB ready)

## Phase 3 — Student CRUD ✅ (12 tests green)
- [x] StudentRequest / StudentResponse DTOs
- [x] StudentService + impl
- [x] StudentController (5 endpoints)
- [x] StudentNotFoundException + DuplicateResourceException (early, reused in Phase 7)
- [x] Tests: repository (@DataJpaTest/H2), service (Mockito), controller (@WebMvcTest)
- [ ] Postman CRUD cycle (after MySQL up + Phase 8 security note)

## Phase 4 — Subject CRUD ✅ (20 tests green total)
- [x] SubjectRequest (@NotBlank name, @Positive maxMarks) / SubjectResponse
- [x] SubjectService + impl (+ duplicate-name guard, SubjectNotFoundException)
- [x] SubjectController (5 endpoints)
- [x] Tests: service (Mockito) + controller (@WebMvcTest)
- [x] TEMP SecurityConfig permitAll added (so Postman works pre-Phase-8; replaced in Phase 8)
- [ ] Postman CRUD cycle (needs MySQL running)

## Phase 5 — Marks + Grade ⭐ ✅ (40 tests green total)
- [x] GradeCalculatorTest (written first, all boundaries + maxMarks<=0)
- [x] GradeCalculator (@Component, pure percentage logic)
- [x] MarkRequest / MarkResponse DTOs
- [x] MarkService + impl (load, dup-check, range-check, grade, save)
- [x] MarkController (POST, GET by student)
- [x] MarkAlreadyExistsException; duplicate + out-of-range covered by tests
- [ ] Postman check (needs MySQL running)

## Phase 6 — Results ✅ (44 tests green total)
- [x] ResultResponse (+ nested SubjectResult) + ResultStatus enum
- [x] ResultService + impl (aggregate totals, overall %, per-subject pass/fail, NO_RESULT)
- [x] ResultController (GET /results/{studentId})
- [x] FAIL when any subject <40%; PASS otherwise; NO_RESULT when no marks
- [x] Tests: service (Mockito) — pass/fail/no-result/not-found

## Phase 7 — Exceptions ✅ (47 tests green total)
- [x] Custom exceptions (added incrementally Phases 3-5: StudentNotFound,
      SubjectNotFound, MarkAlreadyExists, DuplicateResource)
- [x] ErrorResponse DTO (status, message, timestamp)
- [x] GlobalExceptionHandler (@RestControllerAdvice): 404 / 409 / 400 / 400-validation
      (field messages) / 403 / 500-generic
- [x] No placeholders to swap — custom exceptions used from the start
- [x] Tests: 404/409/400 error shape verified via @WebMvcTest

## Phase 8 — Auth + JWT + RBAC ✅ (58 tests green total)
- [x] RegisterRequest / LoginRequest / AuthResponse / RegisterResponse
- [x] AuthService + impl (register w/ BCrypt + dup guard, login via AuthenticationManager)
- [x] JwtUtil (generate/parse/validate, constructor-injected secret)
- [x] CustomUserDetailsService (ROLE_ prefix authorities)
- [x] JwtFilter (OncePerRequestFilter; wired as @Bean in SecurityConfig)
- [x] SecurityConfig: stateless, public /auth + swagger, JWT filter, BCrypt,
      @EnableMethodSecurity, 401 entry point
- [x] @PreAuthorize: ADMIN writes, ADMIN+USER reads (students/subjects/marks/results)
- [x] TEMP permitAll config REPLACED
- [x] Integration test proves 401 (no token) / 403 (wrong role) / 201 (admin) / 401 (bad pw)

## Phase 9 — Validation + Swagger + Tests + README ✅ (58 tests green)
- [x] @Valid + Bean Validation on all request DTOs (done across Phases 3-8)
- [x] MethodArgumentNotValidException → 400 with field errors (Phase 7)
- [x] OpenAPI bean with JWT bearer scheme; Swagger Authorize button
- [x] service unit tests (Mockito)
- [x] @WebMvcTest controller tests + @DataJpaTest + integration test
- [x] README.md with setup, architecture, API table, grade scale
- [x] `./mvnw test` green (58 tests)

## Stretch
- [ ] Pagination on lists
- [ ] Docker + docker-compose
- [ ] GitHub Actions CI
