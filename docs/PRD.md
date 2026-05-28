# PRD — Student Result Management System (SRMS)

## 1. Problem
Schools/colleges need a simple, secure backend to record student marks per
subject and produce result cards with auto-calculated grades and pass/fail status.
Manual spreadsheets are error-prone and have no access control.

## 2. Goal
A production-shaped REST API that lets an admin manage students, subjects, and
marks, and lets authenticated users fetch computed result cards — all behind JWT
auth with role-based permissions.

## 3. Out of scope (v1)
- Frontend UI (API-only; demo via Swagger + Postman)
- Multiple academic terms / semesters
- File uploads, email notifications
- Multi-tenancy (one institution)

## 4. Users / roles
| Role  | Can do |
|-------|--------|
| ADMIN | Create/read/update/delete students, subjects, marks. Read results. |
| USER  | Read students, read results. No writes. |

## 5. Core features
1. **Auth** — register, login, JWT issuance.
2. **Student management** — full CRUD, unique email + roll number.
3. **Subject management** — full CRUD, name + maxMarks.
4. **Mark assignment** — assign marksObtained for (student, subject); grade
   auto-computed; reject duplicates and out-of-range marks.
5. **Result generation** — per-student result card: each subject's marks + grade,
   overall percentage, overall pass/fail.

## 6. Domain rules
### Grade (per subject)
`percentage = marksObtained / maxMarks * 100`
| Grade | Condition          |
|-------|--------------------|
| A+    | percentage >= 90   |
| A     | percentage >= 75   |
| B     | percentage >= 60   |
| C     | percentage >= 50   |
| D     | percentage >= 40   |
| F     | percentage < 40    |

### Result (overall)
- Overall percentage = total marksObtained / total maxMarks * 100.
- **Pass** only if percentage >= 40 in *every* subject; otherwise **Fail**.
- A student with zero marks recorded → result is empty (not "Fail").

## 7. Non-functional requirements
- **Security**: JWT on all non-auth endpoints; BCrypt password hashing; no secrets in repo.
- **Validation**: all input validated at the boundary; clear field-level errors.
- **Error format**: uniform JSON `{ status, message, timestamp }`.
- **Docs**: Swagger UI auto-generated.
- **Tests**: 80%+ on business logic, 100% on grade calculation.
- **Portability**: runs via `./mvnw` + a local MySQL; config externalized.

## 8. Success criteria (resume-demoable)
- All endpoints in `docs/api-spec.md` return correct responses in Postman.
- Unauthorized requests to protected endpoints return 401/403.
- Grade + pass/fail logic provably correct via unit tests.
- `./mvnw test` green; Swagger UI lists every endpoint.

## 9. Interview talking points (why this project shows skill)
- Layered architecture with DTO boundary (no entity leakage).
- Junction entity (`Mark`) with extra data — beyond a naive join table.
- Stateless JWT auth + role-based authorization with a custom filter.
- Centralized exception handling + consistent error contract.
- Domain logic isolated and unit-tested (grade calculator).
