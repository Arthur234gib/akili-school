# AKILI School - Backend ERP/LMS System

Enterprise Resource Planning (ERP) and Learning Management System (LMS) for Akili School.

## Features

### ERP Modules
- **Student Management**: Complete CRUD operations for student records
- **Teacher Management**: Teacher accounts and assignment management
- **Course Management**: Create and manage courses with enrollments
- **Attendance Tracking**: Record and monitor student attendance
- **Financial Management**: Track fees, payments, and transactions
- **Grading System**: Manage student grades and performance

### LMS Modules
- **Assignment Management**: Create and distribute assignments
- **Content Management**: Upload and organize learning resources
- **Progress Tracking**: Monitor student learning progress
- **Announcements**: School-wide communication system

## Installation

```bash
cd backend
npm install
```

## Database Setup

1. Install PostgreSQL
2. Create database:
```bash
createdb akili_db
```

3. Run schema:
```bash
psql -U postgres -d akili_db -f db/schema.sql
```

4. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

## Development

```bash
npm run dev
```

Server will start on http://localhost:3000

## Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password

### Students
- `GET /api/students` - List all students (admin/teacher)
- `GET /api/students/:id` - Get student details
- `POST /api/students` - Create new student (admin)
- `PUT /api/students/:id` - Update student (admin)
- `DELETE /api/students/:id` - Delete student (admin)

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:id/enrollments` - Get course enrollments
- `POST /api/courses` - Create new course (admin/teacher)
- `PUT /api/courses/:id` - Update course (admin/teacher)
- `DELETE /api/courses/:id` - Delete course (admin)
- `POST /api/courses/:id/enroll` - Enroll student in course

### Assignments
- `GET /api/assignments` - List all assignments
- `GET /api/assignments/:id` - Get assignment details
- `GET /api/assignments/course/:courseId` - Get course assignments
- `POST /api/assignments` - Create assignment (admin/teacher)
- `PUT /api/assignments/:id` - Update assignment (admin/teacher)
- `DELETE /api/assignments/:id` - Delete assignment (admin/teacher)

### Attendance
- `GET /api/attendance/student/:studentId/course/:courseId` - Get attendance records
- `GET /api/attendance/course/:courseId/date/:date` - Get attendance for date
- `POST /api/attendance` - Record attendance (admin/teacher)
- `PUT /api/attendance/:id` - Update attendance (admin/teacher)
- `DELETE /api/attendance/:id` - Delete attendance (admin)

### Other
- `GET /health` - Health check endpoint
- `POST /api/payment/charge` - Process payment
- `POST /api/sync/push` - Sync data push
- `GET /api/sync/pull` - Sync data pull
- `POST /api/ocr/upload` - OCR document upload
- `POST /api/nfc/scan` - NFC card scan

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Roles
- `admin` - Full system access
- `teacher` - Manage courses, assignments, grades, attendance
- `student` - View own data, submit assignments
- `parent` - View child's data
- `staff` - Administrative tasks

## Testing

```bash
npm test
```

## Project Structure

```
backend/
├── db/
│   └── schema.sql          # Database schema
├── src/
│   ├── index.ts            # Application entry point
│   ├── lib/
│   │   ├── db.ts          # Database connection
│   │   └── logger.ts      # Winston logger
│   ├── middleware/
│   │   └── auth.ts        # Authentication middleware
│   ├── models/
│   │   ├── User.ts        # User model
│   │   ├── Student.ts     # Student model
│   │   ├── Course.ts      # Course model
│   │   ├── Enrollment.ts  # Enrollment model
│   │   ├── Assignment.ts  # Assignment model
│   │   └── Attendance.ts  # Attendance model
│   └── routes/
│       ├── auth.ts        # Authentication routes
│       ├── students.ts    # Student routes
│       ├── courses.ts     # Course routes
│       ├── assignments.ts # Assignment routes
│       └── attendance.ts  # Attendance routes
├── package.json
├── tsconfig.json
└── .env.example
```

## Default Admin Account

- Username: `admin`
- Password: `admin123`
- Email: `admin@akili.school`

**⚠️ IMPORTANT: Change the admin password in production!**

## License

Copyright © 2026 Akili School

