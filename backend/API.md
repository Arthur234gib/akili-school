# Akili School API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Students API

### List Students
```http
GET /students?limit=100&offset=0
Authorization: Bearer <token>
Roles: admin, teacher

Response:
{
  "students": [...],
  "count": 10
}
```

### Get Student by ID
```http
GET /students/:id
Authorization: Bearer <token>
Roles: admin, teacher, student (own data only)

Response:
{
  "id": 1,
  "user_id": 5,
  "student_number": "STU2024001",
  "date_of_birth": "2005-01-15",
  "gender": "M",
  "enrollment_date": "2024-09-01",
  "status": "active",
  ...
}
```

### Create Student
```http
POST /students
Authorization: Bearer <token>
Roles: admin
Content-Type: application/json

{
  "username": "john.doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+237670000000",
  "student_number": "STU2024001",
  "date_of_birth": "2005-01-15",
  "gender": "M",
  "address": "123 Main St, Douala",
  "parent_name": "Jane Doe",
  "parent_phone": "+237670000001",
  "parent_email": "jane.doe@example.com",
  "enrollment_date": "2024-09-01",
  "status": "active"
}
```

### Update Student
```http
PUT /students/:id
Authorization: Bearer <token>
Roles: admin
Content-Type: application/json

{
  "status": "graduated",
  "address": "456 New St, Douala"
}
```

### Delete Student
```http
DELETE /students/:id
Authorization: Bearer <token>
Roles: admin
```

## Courses API

### List Courses
```http
GET /courses?limit=100&offset=0
Authorization: Bearer <token>

Response:
{
  "courses": [...],
  "count": 15
}
```

### Get Course by ID
```http
GET /courses/:id
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "code": "MATH101",
  "name": "Introduction to Mathematics",
  "description": "Basic mathematics course",
  "teacher_id": 3,
  "credits": 3,
  "level": "Grade 10",
  "subject": "Mathematics",
  "start_date": "2024-09-01",
  "end_date": "2025-06-30",
  "status": "active",
  "max_students": 30
}
```

### Get Course Enrollments
```http
GET /courses/:id/enrollments
Authorization: Bearer <token>
Roles: admin, teacher

Response:
{
  "enrollments": [...],
  "count": 25
}
```

### Create Course
```http
POST /courses
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

{
  "code": "MATH101",
  "name": "Introduction to Mathematics",
  "description": "Basic mathematics course",
  "teacher_id": 3,
  "credits": 3,
  "level": "Grade 10",
  "subject": "Mathematics",
  "start_date": "2024-09-01",
  "end_date": "2025-06-30",
  "status": "active",
  "max_students": 30
}
```

### Enroll Student
```http
POST /courses/:id/enroll
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

{
  "student_id": 5
}
```

## Assignments API

### List All Assignments
```http
GET /assignments?limit=100&offset=0
Authorization: Bearer <token>
```

### Get Assignment by ID
```http
GET /assignments/:id
Authorization: Bearer <token>
```

### List Assignments by Course
```http
GET /assignments/course/:courseId
Authorization: Bearer <token>

Response:
{
  "assignments": [...],
  "count": 8
}
```

### Create Assignment
```http
POST /assignments
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

{
  "course_id": 1,
  "title": "Homework 1: Algebra Basics",
  "description": "Complete exercises 1-10 on page 45",
  "due_date": "2024-10-15T23:59:00Z",
  "max_points": 100,
  "type": "homework",
  "status": "published"
}
```

### Update Assignment
```http
PUT /assignments/:id
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

{
  "status": "closed",
  "max_points": 110
}
```

## Attendance API

### Get Attendance by Student and Course
```http
GET /attendance/student/:studentId/course/:courseId
Authorization: Bearer <token>

Response:
{
  "attendance": [...],
  "count": 45
}
```

### Get Attendance by Course and Date
```http
GET /attendance/course/:courseId/date/:date
Authorization: Bearer <token>
Roles: admin, teacher

Example: GET /attendance/course/1/date/2024-10-15
```

### Record Attendance
```http
POST /attendance
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

{
  "student_id": 5,
  "course_id": 1,
  "date": "2024-10-15",
  "status": "present",
  "notes": "On time"
}
```

### Bulk Record Attendance
```http
POST /attendance
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

[
  {
    "student_id": 5,
    "course_id": 1,
    "date": "2024-10-15",
    "status": "present"
  },
  {
    "student_id": 6,
    "course_id": 1,
    "date": "2024-10-15",
    "status": "absent"
  }
]
```

## Grades API

### Get Student Grades
```http
GET /grades/student/:studentId
Authorization: Bearer <token>

Response:
{
  "grades": [...],
  "count": 12
}
```

### Get Student Grades for a Course
```http
GET /grades/student/:studentId/course/:courseId
Authorization: Bearer <token>

Response:
{
  "grades": [...],
  "average": 85.5,
  "count": 4
}
```

### Get All Grades for a Course
```http
GET /grades/course/:courseId
Authorization: Bearer <token>
Roles: admin, teacher
```

### Create Grade
```http
POST /grades
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

{
  "student_id": 5,
  "course_id": 1,
  "assignment_id": 3,
  "grade_value": 85,
  "grade_letter": "B",
  "weight": 1.0
}
```

### Update Grade
```http
PUT /grades/:id
Authorization: Bearer <token>
Roles: admin, teacher
Content-Type: application/json

{
  "grade_value": 90,
  "grade_letter": "A"
}
```

## Payment API

### Process Payment
```http
POST /payment/charge
Content-Type: application/json

{
  "amount": 50000,
  "currency": "XAF",
  "method": "mobile_money"
}

Response:
{
  "status": "ok",
  "provider": "mock",
  "amount": 50000,
  "currency": "XAF",
  "method": "mobile_money",
  "transactionId": "mock_1634567890123"
}
```

## Sync API

### Push Data
```http
POST /sync/push
Content-Type: application/json

{
  "data": {...}
}

Response:
{
  "status": "pushed"
}
```

### Pull Data
```http
GET /sync/pull

Response:
{
  "changes": []
}
```

## OCR API

### Upload Document for OCR
```http
POST /ocr/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: <file>

Response:
{
  "status": "queued",
  "files": 1
}
```

## NFC API

### Scan NFC Card
```http
POST /nfc/scan
Content-Type: application/json

{
  "uid": "04:52:73:CA:29:4F:80",
  "readerId": "reader_001"
}

Response:
{
  "status": "ok",
  "uid": "04:52:73:CA:29:4F:80",
  "readerId": "reader_001"
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

## Pagination

List endpoints support pagination via query parameters:
- `limit` - Number of results per page (default: 100, max: 100)
- `offset` - Number of results to skip (default: 0)

Example:
```
GET /students?limit=20&offset=40
```

## User Roles

- `admin` - Full system access
- `teacher` - Can manage courses, assignments, grades, attendance
- `student` - Can view own data, submit assignments
- `parent` - Can view child's data
- `staff` - Administrative support

## Date/Time Format

All dates and times use ISO 8601 format:
```
2024-10-15T14:30:00Z
```
