# Architecture — SRMS

## 1. Layered design
```
HTTP request
   │
   ▼
[ Controller ]   ← @RestController. Parses request DTO, calls service, returns response DTO.
   │             ← @Valid runs here. @PreAuthorize role checks here.
   ▼
[ Service ]      ← interface + impl. ALL business logic. Maps entity <-> DTO.
   │             ← throws domain exceptions (StudentNotFoundException, ...).
   ▼
[ Repository ]   ← Spring Data JPA interface. DB access only.
   │
   ▼
[ Entity / DB ]  ← JPA entities mapped to MySQL tables.

Cross-cutting:
[ Security filter chain ]  ← JwtFilter runs before controllers.
[ GlobalExceptionHandler ] ← @RestControllerAdvice, converts exceptions -> error JSON.
```

### Why these boundaries
- **Controller thin**: only HTTP concerns. Easy to test, easy to swap transport.
- **Service owns logic**: testable without HTTP or DB (mock the repository).
- **DTO boundary**: entities never serialized to JSON. Prevents lazy-loading
  serialization bugs, accidental field exposure, and tight coupling of API to schema.

## 2. Data model
```
Student 1 ───< Mark >─── 1 Subject
            (junction entity with extra column: marksObtained, grade)
User (auth) ── role
```

### Entities
**Student**: `id`, `name`, `email` (unique), `rollNumber` (unique).
**Subject**: `id`, `name`, `maxMarks`.
**Mark**: `id`, `marksObtained`, `grade`, `student` (ManyToOne), `subject` (ManyToOne).
  - Unique constraint on `(student_id, subject_id)` → one mark per student/subject pair.
**User**: `id`, `username` (unique), `password` (BCrypt hash), `role` (enum ADMIN/USER).
  Mapped to table `app_user` — `user` is a SQL reserved word.

Note: `Mark`'s `@ManyToOne` relations use `FetchType.LAZY` (not the EAGER default)
to avoid unnecessary joins; entity→DTO mapping happens inside the service transaction
so lazy proxies resolve fine.

### Why Mark is an entity, not a join table
It carries data beyond the relationship (`marksObtained`, `grade`). A pure
`@ManyToMany` join table can't hold extra columns. So we model two `@ManyToOne`
relations into an explicit `Mark` entity.

## 3. Grade calculation
Single class `service/GradeCalculator` (or static util) with one pure method:
`Grade calculate(int marksObtained, int maxMarks)`.
- Pure (no I/O) → trivially unit-testable, 100% coverage target.
- Called by `MarkService` at assignment time; grade is **persisted** on the Mark
  (denormalized) so reads are cheap and historical grade is stable.

## 4. Request flow examples
### Assign marks (POST /marks)
1. Controller receives `MarkRequest{studentId, subjectId, marksObtained}`, `@Valid`.
2. `@PreAuthorize("hasRole('ADMIN')")`.
3. Service loads Student + Subject (throw NotFound if missing).
4. Service checks no existing Mark for pair (throw MarkAlreadyExists if dup).
5. Service validates `0 <= marksObtained <= subject.maxMarks`.
6. `GradeCalculator.calculate(...)` → grade.
7. Save Mark. Map to `MarkResponse`. Return 201.

### Get result (GET /results/{studentId})
1. Service loads student (throw NotFound if missing).
2. Load all marks for student.
3. Sum obtained / max → overall percentage.
4. Pass if every subject percentage >= 40.
5. Build `ResultResponse` (list of line items + summary). Return 200.

## 5. Security architecture
```
Request ──> JwtFilter ──> SecurityFilterChain ──> Controller
             │
             ├─ no/invalid token + protected route ──> 401
             └─ valid token ──> set Authentication in SecurityContext
                                 ──> @PreAuthorize checks role ──> 403 if wrong role
```
- **Stateless**: `SessionCreationPolicy.STATELESS`, no server session.
- **JwtUtil**: generate(username, role) → token; validate; extract claims.
- **JwtFilter** (`OncePerRequestFilter`): reads `Authorization: Bearer`, validates,
  populates `SecurityContextHolder`.
- **SecurityConfig**: defines public matchers, registers filter, BCrypt encoder,
  `AuthenticationManager`.

## 6. Error handling
`@RestControllerAdvice` maps:
| Exception | HTTP |
|-----------|------|
| StudentNotFoundException / SubjectNotFoundException | 404 |
| MarkAlreadyExistsException | 409 |
| MethodArgumentNotValidException (@Valid fails) | 400 |
| BadCredentials / auth failures | 401 |
| AccessDeniedException | 403 |
| anything else | 500 (generic message, log details) |

Body always: `{ "status": <int>, "message": <string>, "timestamp": <ISO-8601> }`.

## 7. Package map
```
com.example.studentresult
├── controller/      AuthController, StudentController, SubjectController, MarkController, ResultController
├── service/         interfaces: StudentService, SubjectService, MarkService, ResultService, AuthService
│   ├── impl/        *ServiceImpl
│   └── GradeCalculator
├── repository/      StudentRepository, SubjectRepository, MarkRepository, UserRepository
├── entity/          Student, Subject, Mark, User, Role(enum), Grade(enum)
├── dto/
│   ├── request/     StudentRequest, SubjectRequest, MarkRequest, RegisterRequest, LoginRequest
│   └── response/    StudentResponse, SubjectResponse, MarkResponse, ResultResponse, AuthResponse, ErrorResponse
├── exception/       StudentNotFoundException, SubjectNotFoundException, MarkAlreadyExistsException, GlobalExceptionHandler
├── security/        JwtUtil, JwtFilter, SecurityConfig, CustomUserDetailsService
└── StudentResultApplication.java
```
