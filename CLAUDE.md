# CLAUDE.md — Student Result Management System

Project-local instructions. Overrides global rules where they conflict.

## What this is
REST API backend for managing students, subjects, marks, and auto-graded results.
JWT-secured with role-based access. Portfolio / interview showcase project.

## Tech stack
- Java 17+ (dev machine runs Java 22)
- Spring Boot 3.x
- Spring Data JPA + Hibernate
- MySQL 8
- Spring Security + JWT (`io.jsonwebtoken` / jjwt 0.11.x)
- Lombok
- springdoc-openapi (Swagger UI)
- JUnit 5 + Mockito
- Maven 3.9.9 (wrapper `./mvnw` committed — works everywhere)

## Build & run
Run Maven from **PowerShell** (the git-bash `mvn` shim is broken on this machine;
the wrapper or PowerShell both work fine):
```powershell
.\mvnw.cmd clean spring-boot:run   # run app
.\mvnw.cmd test                    # run tests
.\mvnw.cmd clean package           # build jar
```
(`./mvnw ...` also works from any POSIX shell.)
Swagger UI: http://localhost:8080/swagger-ui.html
First run: ensure MySQL is up and `srms` database exists (see docs/phase-plan.md Phase 1).

## Package root
`com.example.studentresult`

## Architecture rules (project-specific)
- Layered: controller → service (interface + impl) → repository → entity.
- **Never** return JPA entities from controllers. Map to response DTOs.
- **Never** accept entities as request bodies. Use request DTOs with `@Valid`.
- Business logic lives in service impls, not controllers or entities.
- Grade calculation is the one piece of real domain logic — keep it in a single,
  unit-tested method (`GradeCalculator`), not scattered.
- All errors flow through `GlobalExceptionHandler` (`@RestControllerAdvice`).
  Error JSON shape is fixed: `{ "status", "message", "timestamp" }`.

## Security model
- Public: `POST /auth/register`, `POST /auth/login`, Swagger endpoints.
- Everything else requires `Authorization: Bearer <token>`.
- Roles: `ADMIN` (full CRUD), `USER` (read-only results). Enforced with
  `@PreAuthorize` on controller methods.
- Passwords hashed with BCrypt. JWT secret + expiry in `application.properties`
  (never commit real secret — use `application-example.properties` as template).

## Conventions
- File size limit: 300 lines (global rule). Split by responsibility before exceeding.
- Constructor injection only (Lombok `@RequiredArgsConstructor`). No field `@Autowired`.
- DTOs are Java `record`s where possible (immutable, concise).
- Test files mirror source path under `src/test/java/...`.
- Conventional commits: `feat(student): ...`, `fix(marks): ...`, etc.
- Coverage target: 80%+ on service-layer business logic; 100% on grade logic.

## Workflow expectations
- Build one phase at a time (docs/phase-plan.md). Don't start a phase until the
  previous one passes its Postman / test acceptance checks.
- Type/build gate after each change: `./mvnw compile` must pass before "done".
- Write the grade-logic test BEFORE the grade logic (TDD for the core).

## Key docs
- `docs/PRD.md` — what & why
- `docs/architecture.md` — layers, data model, request flow
- `docs/phase-plan.md` — the 9-phase build plan (primary working doc)
- `docs/api-spec.md` — endpoint contracts
- `docs/task-list.md` — checklist tracker
