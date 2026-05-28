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

## Phase 2 — Entities & Repositories
- [ ] Student, Subject, Mark entities
- [ ] User, Role enum, Grade enum
- [ ] 4 repositories with custom finders
- [ ] Tables auto-created in MySQL with constraints

## Phase 3 — Student CRUD
- [ ] StudentRequest / StudentResponse DTOs
- [ ] StudentService + impl
- [ ] StudentController (5 endpoints)
- [ ] Postman CRUD cycle passes

## Phase 4 — Subject CRUD
- [ ] SubjectRequest / SubjectResponse DTOs
- [ ] SubjectService + impl
- [ ] SubjectController (5 endpoints)
- [ ] Postman CRUD cycle passes

## Phase 5 — Marks + Grade ⭐
- [ ] GradeCalculatorTest (write first)
- [ ] GradeCalculator
- [ ] MarkRequest / MarkResponse DTOs
- [ ] MarkService + impl (load, dup-check, range-check, grade, save)
- [ ] MarkController (POST, GET by student)
- [ ] duplicate → 409, out-of-range → 400

## Phase 6 — Results
- [ ] ResultResponse (+ SubjectResult)
- [ ] ResultService + impl (aggregate, pass/fail, NO_RESULT case)
- [ ] ResultController
- [ ] FAIL when any subject <40; PASS otherwise

## Phase 7 — Exceptions
- [ ] 3 custom exceptions
- [ ] ErrorResponse DTO
- [ ] GlobalExceptionHandler (@RestControllerAdvice)
- [ ] swap placeholders → custom exceptions
- [ ] all errors return {status,message,timestamp}

## Phase 8 — Auth + JWT + RBAC
- [ ] RegisterRequest / LoginRequest / AuthResponse
- [ ] AuthService + impl (register, login)
- [ ] JwtUtil (generate/parse/validate)
- [ ] CustomUserDetailsService
- [ ] JwtFilter
- [ ] SecurityConfig (filter chain, public matchers, BCrypt, @EnableMethodSecurity)
- [ ] @PreAuthorize on write/read endpoints
- [ ] 401 no token, 403 wrong role, 200 right role

## Phase 9 — Validation + Swagger + Tests + README
- [ ] @Valid + Bean Validation on all request DTOs
- [ ] MethodArgumentNotValidException → 400 with field errors
- [ ] OpenAPI bean with JWT scheme; Swagger Authorize works
- [ ] service unit tests (Mockito) 80%+
- [ ] @WebMvcTest controller tests
- [ ] README.md with setup, diagram, samples, screenshots
- [ ] `./mvnw test` green

## Stretch
- [ ] Pagination on lists
- [ ] Docker + docker-compose
- [ ] GitHub Actions CI
