# API Spec — SRMS

Base URL: `http://localhost:8080`
Auth: send `Authorization: Bearer <token>` on every endpoint except `/auth/*` and Swagger.

## Error shape (all errors)
```json
{ "status": 404, "message": "Student not found with id 5", "timestamp": "2026-05-28T10:15:30Z" }
```

---

## Auth
### POST /auth/register  (public)
Req:
```json
{ "username": "admin", "password": "Secret123", "role": "ADMIN" }
```
`role` optional → defaults to `USER`. 201 on success.

### POST /auth/login  (public)
Req:
```json
{ "username": "admin", "password": "Secret123" }
```
Res 200:
```json
{ "token": "eyJhbGci...", "username": "admin", "role": "ADMIN", "expiresIn": 3600 }
```
401 on bad credentials.

---

## Students   (ADMIN write, USER+ADMIN read)
### POST /students   `ADMIN`
Req:
```json
{ "name": "Asha R", "email": "asha@example.com", "rollNumber": "CS-101" }
```
Res 201: `StudentResponse`.

### GET /students   `USER|ADMIN`
Res 200: `[ StudentResponse ]`.

### GET /students/{id}   `USER|ADMIN`
Res 200: `StudentResponse`. 404 if missing.

### PUT /students/{id}   `ADMIN`
Req: same as POST. Res 200: updated `StudentResponse`.

### DELETE /students/{id}   `ADMIN`
Res 204. 404 if missing.

`StudentResponse`:
```json
{ "id": 1, "name": "Asha R", "email": "asha@example.com", "rollNumber": "CS-101" }
```

---

## Subjects   (ADMIN write, USER+ADMIN read)
### POST /subjects   `ADMIN`
```json
{ "name": "Mathematics", "maxMarks": 100 }
```
### GET /subjects · GET /subjects/{id} · PUT /subjects/{id} · DELETE /subjects/{id}
Same CRUD pattern as students.

`SubjectResponse`:
```json
{ "id": 1, "name": "Mathematics", "maxMarks": 100 }
```

---

## Marks   (ADMIN write, USER+ADMIN read)
### POST /marks   `ADMIN`
Req:
```json
{ "studentId": 1, "subjectId": 1, "marksObtained": 82 }
```
Res 201:
```json
{ "id": 10, "studentId": 1, "subjectName": "Mathematics", "marksObtained": 82, "maxMarks": 100, "grade": "A" }
```
Errors: 404 (student/subject missing), 409 (mark already exists for pair),
400 (marksObtained < 0 or > maxMarks).

### GET /marks/{studentId}   `USER|ADMIN`
Res 200: `[ MarkResponse ]` for that student. 404 if student missing.

---

## Results   (USER+ADMIN read)
### GET /results/{studentId}   `USER|ADMIN`
Res 200:
```json
{
  "studentId": 1,
  "studentName": "Asha R",
  "rollNumber": "CS-101",
  "subjects": [
    { "subjectName": "Mathematics", "maxMarks": 100, "marksObtained": 82, "grade": "A" },
    { "subjectName": "Physics", "maxMarks": 100, "marksObtained": 35, "grade": "F" }
  ],
  "totalMarksObtained": 117,
  "totalMaxMarks": 200,
  "overallPercentage": 58.5,
  "status": "FAIL"
}
```
404 if student missing. If no marks recorded: `subjects: []`, totals 0, status `"NO_RESULT"`.
