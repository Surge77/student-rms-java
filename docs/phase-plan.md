# Phase Plan — SRMS

Build one phase at a time. Don't start a phase until the prior phase passes its
acceptance checks. After each phase: `./mvnw compile` must pass, then run the
Postman / test checks listed.

Legend: **Goal** · **Files** · **Implement** · **Acceptance** · **Watch out** · **Test**.

---

## Phase 1 — Project Setup & DB Connection  ✅ scaffolded for you
**Goal:** Empty Spring Boot app boots and connects to MySQL.

**Files (already created):**
- `pom.xml`
- `src/main/resources/application.properties`
- `src/main/resources/application-example.properties` (template, safe to commit)
- `src/main/java/com/example/studentresult/StudentResultApplication.java`
- `.gitignore`, `mvnw`, `mvnw.cmd`, `.mvn/wrapper/...`

**You do:**
1. Install/start MySQL 8. Create DB: `CREATE DATABASE srms;`
2. Copy `application-example.properties` → `application.properties`, fill in your
   MySQL username/password and a JWT secret (any 32+ char random string).
3. Run `./mvnw spring-boot:run`.

**Concept to understand first:** Spring Boot auto-configuration. The single
`@SpringBootApplication` annotation triggers component scanning + auto-config of
the datasource from `application.properties`. You write almost no wiring code.

**Acceptance:** App starts, logs `Started StudentResultApplication`, no datasource error.
**Watch out:**
- Wrong MySQL port/credentials → `Communications link failure`. Verify MySQL running.
- `ddl-auto=update` creates tables once entities exist (Phase 2). Phase 1 has none yet — that's fine.
- Don't commit real `application.properties` (it has secrets). It's gitignored.
**Test:** Visit `http://localhost:8080` → expect Whitelabel 404 (means server is up).

---

## Phase 2 — Entities & Repositories
**Goal:** JPA entities exist; Hibernate creates the tables; repositories compile.

**Files:**
- `entity/Student.java`, `entity/Subject.java`, `entity/Mark.java`
- `entity/User.java`, `entity/Role.java` (enum ADMIN/USER), `entity/Grade.java` (enum A_PLUS, A, B, C, D, F)
- `repository/StudentRepository.java`, `SubjectRepository.java`, `MarkRepository.java`, `UserRepository.java`

**Implement:**
- `Student`: `@Entity`, `@Id @GeneratedValue` id, name, `@Column(unique=true)` email, unique rollNumber.
- `Subject`: id, name, maxMarks (int).
- `Mark`: id, marksObtained (int), `@Enumerated(EnumType.STRING) Grade grade`,
  `@ManyToOne Student student`, `@ManyToOne Subject subject`,
  `@Table(uniqueConstraints=@UniqueConstraint(columnNames={"student_id","subject_id"}))`.
- `User`: id, unique username, password, `@Enumerated(EnumType.STRING) Role role`.
- Repositories extend `JpaRepository<Entity, Long>`. Add finders you'll need:
  - `MarkRepository`: `List<Mark> findByStudentId(Long studentId)`,
    `boolean existsByStudentIdAndSubjectId(Long s, Long sub)`.
  - `StudentRepository`: `boolean existsByEmail(String email)`.
  - `UserRepository`: `Optional<User> findByUsername(String username)`.
- Use Lombok `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder`.

**Concept first:** JPA relationships. `@ManyToOne` is the owning side and creates the
FK column (`student_id`). Default fetch for `@ManyToOne` is EAGER — fine here.
Store enums as `STRING` not ordinal, so reordering the enum later doesn't corrupt data.

**Acceptance:** App restarts; MySQL now has `student`, `subject`, `mark`, `user` tables
with correct columns and the FK + unique constraints.
**Watch out:**
- `@Enumerated` defaults to ORDINAL (stores 0,1,2) — always set `EnumType.STRING`.
- Don't add a `@OneToMany` back-reference on Student/Subject unless you need it; if you
  do, mark it `@JsonIgnore`-irrelevant here since we never serialize entities, but avoid
  infinite loops and unnecessary eager loads.
- Lombok: install the IDE plugin or getters won't resolve in the editor.
**Test:** `SHOW TABLES;` and `DESCRIBE mark;` in MySQL — verify columns + constraints.

---

## Phase 3 — Student CRUD
**Goal:** Full create/read/update/delete for students via DTOs.

**Files:**
- `dto/request/StudentRequest.java`, `dto/response/StudentResponse.java`
- `service/StudentService.java` (interface), `service/impl/StudentServiceImpl.java`
- `controller/StudentController.java`

**Implement:**
- `StudentRequest` (record): name, email, rollNumber. Validation annotations come in Phase 9
  (add `@NotBlank`/`@Email` now if you like — harmless).
- `StudentResponse` (record): id, name, email, rollNumber.
- Service interface: `create`, `getAll`, `getById`, `update`, `delete`.
- Impl: map Request→entity, save; map entity→Response on the way out.
  `getById`/`update`/`delete` throw `StudentNotFoundException` (placeholder: use
  `RuntimeException` now, swap to custom in Phase 7) when id missing.
- Controller: `@RestController @RequestMapping("/students")`, constructor-inject service.
  POST→201, GET list→200, GET id→200, PUT→200, DELETE→204.

**Concept first:** DTO mapping. Do it manually (a small `toResponse(entity)` method) so
you understand the boundary. MapStruct is a later optimization, not needed now.

**Acceptance:** All 5 student endpoints work end-to-end against MySQL.
**Watch out:**
- Don't return the entity — return `StudentResponse`. This is the habit interviewers check.
- PUT should update fields then save the *existing* managed entity (preserve id), not create new.
- Security isn't on yet (Phase 8) — endpoints are open for now. That's expected.
**Test (Postman):**
1. POST /students with body → 201 + JSON with `id`.
2. GET /students → array contains it.
3. GET /students/{id} → 200. GET /students/9999 → error (500 for now, 404 after Phase 7).
4. PUT /students/{id} changing name → 200 + new name. DELETE → 204; GET again → not found.

---

## Phase 4 — Subject CRUD
**Goal:** Same CRUD pattern for subjects.

**Files:**
- `dto/request/SubjectRequest.java`, `dto/response/SubjectResponse.java`
- `service/SubjectService.java`, `service/impl/SubjectServiceImpl.java`
- `controller/SubjectController.java`

**Implement:** Mirror Phase 3. Fields: name, maxMarks. Throw `SubjectNotFoundException`
(placeholder RuntimeException for now) on missing id.

**Acceptance:** All 5 subject endpoints work.
**Watch out:**
- `maxMarks` must be positive (enforce in Phase 9 validation). Note it now.
- Resist copy-paste drift: keep the same method names/structure as StudentService so the
  codebase reads consistently.
**Test (Postman):** Same 4-step CRUD cycle as Phase 3 on `/subjects`.

---

## Phase 5 — Mark Assignment + Grade Calculation  ⭐ core logic
**Goal:** Assign a mark to (student, subject); grade auto-computed and stored.

**Files:**
- `service/GradeCalculator.java`
- `dto/request/MarkRequest.java`, `dto/response/MarkResponse.java`
- `service/MarkService.java`, `service/impl/MarkServiceImpl.java`
- `controller/MarkController.java`
- `exception/MarkAlreadyExistsException.java` (or placeholder for now)
- **TEST FIRST:** `src/test/java/.../service/GradeCalculatorTest.java`

**Implement (write the test first — this is the one piece of real domain logic):**
```java
// GradeCalculator: pure, no Spring, no DB
public Grade calculate(int marksObtained, int maxMarks) {
    if (maxMarks <= 0) throw new IllegalArgumentException("maxMarks must be > 0");
    double pct = (double) marksObtained / maxMarks * 100;
    if (pct >= 90) return Grade.A_PLUS;
    if (pct >= 75) return Grade.A;
    if (pct >= 60) return Grade.B;
    if (pct >= 50) return Grade.C;
    if (pct >= 40) return Grade.D;
    return Grade.F;
}
```
- `GradeCalculatorTest`: assert each boundary — 90→A+, 89→A, 75→A, 74→B, 60→B, 59→C,
  50→C, 49→D, 40→D, 39→F, 0→F. (100% coverage target.)
- `MarkServiceImpl.assign(MarkRequest)`:
  1. load Student (else NotFound), load Subject (else NotFound).
  2. `existsByStudentIdAndSubjectId` → if true throw `MarkAlreadyExistsException`.
  3. validate `0 <= marksObtained <= subject.maxMarks` (else IllegalArgument/400).
  4. grade = `gradeCalculator.calculate(...)`. Save Mark. Return MarkResponse.
- `getByStudent(studentId)`: verify student exists, return `findByStudentId` mapped.
- Controller: POST /marks → 201; GET /marks/{studentId} → 200.

**Concept first:** Why store the grade instead of computing on read? Denormalization for
read performance + historical stability. Trade-off: must recompute if a mark is edited
(out of scope v1 — marks are write-once here).

**Acceptance:** POST /marks returns the right grade; duplicate assignment is rejected;
`GradeCalculatorTest` passes.
**Watch out:**
- Integer division bug: `marksObtained / maxMarks` in `int` is always 0. Cast to `double` first.
- Boundary correctness: `>= 90` not `> 90`. Test the exact thresholds.
- Duplicate check must run before save, or you'll hit a DB unique-constraint exception instead
  of a clean 409.
**Test (Postman):** create a student + subject (maxMarks 100), POST /marks {marksObtained:82}
→ grade "A". POST same pair again → 409. POST marksObtained:150 → 400.
GET /marks/{studentId} → array with the mark.

---

## Phase 6 — Result Generation
**Goal:** Per-student result card with overall percentage + pass/fail.

**Files:**
- `dto/response/ResultResponse.java` (+ nested `SubjectResult` record)
- `service/ResultService.java`, `service/impl/ResultServiceImpl.java`
- `controller/ResultController.java`
- (optional but recommended) `service/ResultServiceTest.java`

**Implement:**
- Load student (else NotFound). Load marks via `findByStudentId`.
- If no marks → return ResultResponse with empty list, totals 0, status `NO_RESULT`.
- Else: sum obtained, sum max, overall pct = total/totalMax*100 (cast double).
- Pass rule: `FAIL` if any single subject pct < 40, else `PASS`.
- Build line items (subjectName, maxMarks, marksObtained, grade).

**Concept first:** This is an aggregation/read model — it composes data from multiple
entities into a view DTO that has no direct table. That's a normal and valuable pattern.

**Acceptance:** Result card matches the math; one failing subject flips overall to FAIL.
**Watch out:**
- Round `overallPercentage` consistently (e.g., one decimal) so output is stable.
- Pass/fail is per-subject (any <40 → fail), NOT based on overall percentage. Re-read the rule.
- Empty-marks case must be `NO_RESULT`, not `FAIL`.
**Test (Postman):** assign 2 subjects (one >=40, one <40) → GET /results/{id} → status FAIL,
correct totals. Assign all >=40 → PASS.

---

## Phase 7 — Exception Handling
**Goal:** Uniform error JSON; replace placeholder RuntimeExceptions with custom ones.

**Files:**
- `exception/StudentNotFoundException.java`, `SubjectNotFoundException.java`,
  `MarkAlreadyExistsException.java`
- `dto/response/ErrorResponse.java` (record: status, message, timestamp)
- `exception/GlobalExceptionHandler.java` (`@RestControllerAdvice`)

**Implement:**
- Custom exceptions extend `RuntimeException`, take a message.
- Replace all placeholder `RuntimeException`s in services with these.
- Handler methods (each returns `ResponseEntity<ErrorResponse>`):
  - `StudentNotFound`/`SubjectNotFound` → 404
  - `MarkAlreadyExists` → 409
  - `IllegalArgumentException` (out-of-range marks) → 400
  - `MethodArgumentNotValidException` → 400 (wire fully in Phase 9)
  - generic `Exception` → 500, log the cause, return safe message.
- `timestamp` = `Instant.now().toString()`.

**Concept first:** `@RestControllerAdvice` is a global interceptor for exceptions thrown by
any controller/service in the request path. Centralizes error formatting; controllers stay clean.

**Acceptance:** Every error path returns the exact `{status, message, timestamp}` shape with
correct HTTP code.
**Watch out:**
- Don't leak stack traces / internal messages in the 500 handler — log them, return generic text.
- Order matters: more specific handlers before the catch-all `Exception` handler.
**Test (Postman):** GET /students/9999 → 404 + correct JSON. Duplicate mark → 409. Bad marks → 400.

---

## Phase 8 — JWT Authentication & RBAC
**Goal:** Register/login issue JWTs; all other endpoints require a valid token; roles enforced.

**Files:**
- `dto/request/RegisterRequest.java`, `LoginRequest.java`
- `dto/response/AuthResponse.java`
- `service/AuthService.java`, `service/impl/AuthServiceImpl.java`
- `security/JwtUtil.java`, `security/JwtFilter.java`, `security/SecurityConfig.java`,
  `security/CustomUserDetailsService.java`
- `controller/AuthController.java`

**Implement:**
- `AuthServiceImpl.register`: reject duplicate username; BCrypt-encode password; save User
  with role (default USER if null).
- `AuthServiceImpl.login`: authenticate via `AuthenticationManager`; on success
  `JwtUtil.generate(username, role)`; return `AuthResponse{token, username, role, expiresIn}`.
- `JwtUtil`: build/parse tokens with jjwt 0.11.x. Sign with HS256 key from the configured
  secret. Methods: `generateToken`, `extractUsername`, `extractRole`, `isValid`.
- `CustomUserDetailsService implements UserDetailsService`: load user by username, return
  Spring `UserDetails` with authority `ROLE_<role>`.
- `JwtFilter extends OncePerRequestFilter`: read `Authorization: Bearer`, validate, set
  `UsernamePasswordAuthenticationToken` in `SecurityContextHolder`.
- `SecurityConfig`: `SecurityFilterChain` bean — `csrf disable`, `STATELESS` sessions,
  permitAll on `/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`; everything else
  `authenticated()`; register `JwtFilter` before `UsernamePasswordAuthenticationFilter`;
  expose `PasswordEncoder` (BCrypt) + `AuthenticationManager` beans.
  Enable method security: `@EnableMethodSecurity`.
- Add `@PreAuthorize("hasRole('ADMIN')")` on all write endpoints (POST/PUT/DELETE of
  students, subjects, marks). Reads allow `hasAnyRole('ADMIN','USER')`.

**Concept first (read before coding):**
- **Stateless JWT**: server stores no session. The token *is* the credential; each request
  re-authenticates by validating the signature. This is why we disable CSRF and sessions.
- **Filter ordering**: `JwtFilter` must run before the username/password filter so the
  SecurityContext is populated before authorization checks.
- `ROLE_` prefix: Spring's `hasRole('ADMIN')` checks authority `ROLE_ADMIN`. Add the prefix
  when building authorities; omit it in `hasRole(...)`.

**Acceptance:** Protected endpoints return 401 without a token, 403 with the wrong role, and
200/201 with the right role + valid token.
**Watch out:**
- jjwt 0.11.x API: `Jwts.builder()...signWith(Keys.hmacShaKeyFor(secretBytes))...`. Secret
  must be >= 256 bits (32 bytes) for HS256 or it throws.
- `ROLE_` prefix mismatch is the #1 RBAC bug — symptoms: valid token but always 403.
- Don't forget to permitAll the Swagger paths or you can't view docs.
- BCrypt: store the hash, compare via the encoder — never compare raw strings.
**Test (Postman):**
1. POST /auth/register {admin, ADMIN} → 201. POST /auth/login → token.
2. GET /students with no header → 401. With `Bearer <token>` → 200.
3. Register a USER, login, try POST /students → 403. GET /students → 200.

---

## Phase 9 — Validation, Swagger, Tests, README polish
**Goal:** Boundary validation, interactive docs, test coverage, and a portfolio README.

**Files:**
- Add Bean Validation annotations to all request DTOs.
- `pom.xml`: ensure `spring-boot-starter-validation` + `springdoc-openapi-starter-webmvc-ui`
  are present (already in scaffolded pom).
- `security/SecurityConfig.java`: confirm Swagger paths permitted.
- Tests under `src/test/java/...`: service unit tests (Mockito), `@WebMvcTest` controller
  tests, optional `@SpringBootTest` integration test.
- `README.md` (root) — see structure below.

**Implement:**
- Validation: `@NotBlank name`, `@Email email`, `@NotBlank rollNumber` on StudentRequest;
  `@NotBlank name`, `@Positive maxMarks` on SubjectRequest; `@NotNull`/`@Positive` ids and
  `@PositiveOrZero marksObtained` on MarkRequest; `@NotBlank` on auth DTOs. Add `@Valid` to
  every `@RequestBody` in controllers. Wire `MethodArgumentNotValidException` → 400 with
  field errors in `GlobalExceptionHandler`.
- Swagger: add `@Tag`/`@Operation` annotations optionally; add a JWT security scheme via an
  `OpenAPI` bean so the "Authorize" button works in Swagger UI.
- Tests:
  - `GradeCalculatorTest` (from Phase 5) — keep at 100%.
  - `StudentServiceImplTest`, `MarkServiceImplTest`, `ResultServiceImplTest` — mock repos,
    assert logic + thrown exceptions.
  - `StudentControllerTest` (`@WebMvcTest`) — verify status codes + validation 400s.
- `README.md`: title, one-line pitch, features, architecture diagram (ascii from
  architecture.md), tech stack, setup (MySQL + `./mvnw spring-boot:run`), Swagger link,
  sample requests, test command, screenshots/Postman collection link, license.

**Concept first:** `@Valid` triggers JSR-380 validation on the bound DTO; failures throw
`MethodArgumentNotValidException` *before* your controller body runs — that's why the
exception handler, not the controller, formats the error.

**Acceptance:** Invalid bodies return 400 with field-level messages; Swagger UI lists every
endpoint and supports Bearer auth; `./mvnw test` is green at 80%+ on business logic.
**Watch out:**
- Validation annotations do nothing without `@Valid` on the parameter — easy to forget.
- `@Email` accepts some odd-but-valid formats; don't over-restrict with custom regex unless asked.
- Keep each test isolated (no shared mutable state); mock at the repository boundary, never
  call real MySQL in unit tests.
**Test:** POST /students {empty name, bad email} → 400 with field errors. Open
`/swagger-ui.html`, click Authorize, paste token, call a protected endpoint successfully.

---

## After Phase 9 — stretch (optional, extra resume weight)
- Pagination + sorting on GET /students (`Pageable`).
- Mark update endpoint with grade recompute.
- Dockerfile + docker-compose (app + MySQL) for one-command setup.
- GitHub Actions CI: build + test on push.
- Refresh tokens / token blacklist on logout.
