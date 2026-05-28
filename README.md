# Student Result Management System (SRMS)

A JWT-secured Spring Boot REST API for managing students, subjects, and marks, with
automatic grade calculation and per-student result cards. Built with a clean layered
architecture, role-based access control, centralized error handling, and a full test suite.

## Features
- **JWT authentication** with register/login and BCrypt-hashed passwords
- **Role-based authorization** (`ADMIN` writes, `USER` read-only) via `@PreAuthorize`
- **Student & Subject CRUD** with validation and uniqueness guards
- **Mark assignment** with automatic, percentage-based grade calculation
- **Result generation**: per-subject breakdown, overall percentage, pass/fail status
- **Uniform error contract** through a global `@RestControllerAdvice`
- **Pagination & sorting** on list endpoints (Spring `Pageable`)
- **Mark update with grade recompute** (`PUT /marks/{id}`)
- **Interactive API docs** (Swagger UI with a JWT Authorize button)
- **Dockerized** (multi-stage Dockerfile + docker-compose for app + MySQL)
- **CI** via GitHub Actions (build + test on every push/PR)
- **61 automated tests** (unit + slice + full-context integration)

## Tech stack
Java 17 · Spring Boot 3.3 · Spring Data JPA · Spring Security · MySQL 8 ·
jjwt 0.11.5 · Lombok · springdoc-openapi · JUnit 5 + Mockito · H2 (tests) · Maven

## Architecture
```
Controller  ->  Service (interface + impl)  ->  Repository  ->  Entity / MySQL
   |                 |
 @Valid,          business logic,
 @PreAuthorize    DTO mapping, grade calc
   |
JwtFilter (security chain)   GlobalExceptionHandler (@RestControllerAdvice)
```
- DTO boundary: entities are never exposed in requests/responses.
- `Mark` is a junction entity (two `@ManyToOne`) carrying `marksObtained` + `grade`.
- Grade computed once by `GradeCalculator` and persisted on the mark.

See `docs/` for full PRD, architecture, API spec, and the phase-by-phase build plan.

## Grade scale
| Grade | Percentage |
|-------|------------|
| A+    | >= 90 |
| A     | >= 75 |
| B     | >= 60 |
| C     | >= 50 |
| D     | >= 40 |
| F     | < 40  |

Overall result is **PASS** only if every subject scores >= 40%, else **FAIL**
(`NO_RESULT` when no marks are recorded).

## Getting started
### Prerequisites
- JDK 17+
- MySQL 8 running locally

### Setup
1. Create the database:
   ```sql
   CREATE DATABASE srms;
   ```
2. Configure credentials. Copy the template and edit it:
   ```bash
   cp src/main/resources/application-example.properties src/main/resources/application.properties
   ```
   Set your MySQL username/password and a JWT secret (32+ characters).
3. Run (Windows PowerShell):
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   or any POSIX shell:
   ```bash
   ./mvnw spring-boot:run
   ```
App starts on `http://localhost:8080`. Swagger UI: `http://localhost:8080/swagger-ui.html`.

### Run with Docker (no local Java/MySQL needed)
```bash
docker compose up --build
```
Starts MySQL + the app together. App on `http://localhost:8080`. Config is passed via
environment variables (`SPRING_DATASOURCE_*`, `APP_JWT_SECRET`) in `docker-compose.yml`.

## Authentication flow
1. `POST /auth/register` — create a user (role `ADMIN` or `USER`).
2. `POST /auth/login` — returns a JWT.
3. Send `Authorization: Bearer <token>` on all other requests (or click **Authorize**
   in Swagger UI and paste the token).

## API overview
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | public | Create a user |
| POST | `/auth/login` | public | Get a JWT |
| POST/PUT/DELETE | `/students`, `/subjects` | ADMIN | Manage students/subjects |
| GET | `/students`, `/subjects` | ADMIN, USER | List/read |
| POST | `/marks` | ADMIN | Assign a mark (auto-grades) |
| PUT | `/marks/{id}` | ADMIN | Update a mark (recomputes grade) |
| GET | `/marks/{studentId}` | ADMIN, USER | Marks for a student |
| GET | `/results/{studentId}` | ADMIN, USER | Full result card |

Full request/response shapes: `docs/api-spec.md`.

## Error format
```json
{ "status": 404, "message": "Student not found with id 5", "timestamp": "2026-05-28T10:15:30Z" }
```

## Running tests
```powershell
.\mvnw.cmd test
```
Tests use an in-memory H2 database, so no MySQL is required to run them. Coverage spans
repository (`@DataJpaTest`), service logic (Mockito), controllers (`@WebMvcTest`), the grade
calculator (every boundary), and a full-context security integration test (401/403/200).

## Project structure
```
src/main/java/com/example/studentresult/
├── controller/   REST endpoints
├── service/      interfaces + impl/ + GradeCalculator
├── repository/   Spring Data JPA
├── entity/       Student, Subject, Mark, User, Grade, Role
├── dto/          request/ + response/
├── exception/    custom exceptions + GlobalExceptionHandler
├── security/     JwtUtil, JwtFilter, SecurityConfig, CustomUserDetailsService
└── config/       OpenApiConfig
```

## License
For educational / portfolio use.
