# Akili School - ERP/LMS System

**Système d'exploitation scolaire intelligent** - Intelligent School Operating System

## Overview

Akili School is a comprehensive Enterprise Resource Planning (ERP) and Learning Management System (LMS) designed specifically for educational institutions. The system provides complete digital management of school operations, from student enrollment to learning progress tracking.

## Key Features

### 🎓 Student Management (ERP)
- Complete student information management
- Student enrollment and registration
- Parent/guardian contact management
- Student status tracking (active, graduated, suspended)
- Student number generation and management

### 👨‍🏫 Teacher & Staff Management
- Teacher profile management
- Course assignment tracking
- Role-based access control
- Staff records management

### 📚 Course Management (LMS)
- Course creation and organization
- Student enrollment in courses
- Course scheduling
- Credit and level management
- Multi-subject support

### 📝 Assignment & Assessment
- Create and distribute assignments
- Support for multiple types: homework, quiz, exam, project
- Assignment submission tracking
- Grading and feedback system
- Points and score management

### 📊 Attendance Tracking
- Daily attendance recording
- Multiple status types: present, absent, late, excused
- Course-specific attendance
- Date-based attendance reports
- Attendance history

### 💰 Financial Management
- Tuition and fee tracking
- Payment processing integration
- Transaction history
- Multiple payment methods support
- Financial reports

### 📖 Learning Resources
- Resource library management
- Support for documents, videos, links, images
- Course-specific resources
- Easy upload and organization

### 📢 Communication
- School-wide announcements
- Role-based announcements (admin, teacher, student, parent)
- Priority levels (low, normal, high, urgent)
- Scheduled announcements

## Technology Stack

- **Backend**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Logging**: Winston

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Arthur234gib/akili-school.git
cd akili-school
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Set up the database:
```bash
# Create database
createdb akili_db

# Run schema
psql -U postgres -d akili_db -f db/schema.sql
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Project Structure

```
akili-school/
├── backend/
│   ├── db/
│   │   └── schema.sql          # Database schema
│   ├── src/
│   │   ├── index.ts            # Application entry point
│   │   ├── lib/
│   │   │   ├── db.ts          # Database connection
│   │   │   └── logger.ts      # Logging utility
│   │   ├── middleware/
│   │   │   └── auth.ts        # Authentication middleware
│   │   ├── models/
│   │   │   ├── User.ts        # User model
│   │   │   ├── Student.ts     # Student model
│   │   │   ├── Course.ts      # Course model
│   │   │   ├── Enrollment.ts  # Enrollment model
│   │   │   ├── Assignment.ts  # Assignment model
│   │   │   └── Attendance.ts  # Attendance model
│   │   └── routes/
│   │       ├── auth.ts        # Authentication endpoints
│   │       ├── students.ts    # Student management
│   │       ├── courses.ts     # Course management
│   │       ├── assignments.ts # Assignment management
│   │       ├── attendance.ts  # Attendance tracking
│   │       ├── payment.ts     # Payment processing
│   │       ├── sync.ts        # Data synchronization
│   │       ├── ocr.ts         # OCR processing
│   │       └── nfc.ts         # NFC integration
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

## User Roles

- **Admin**: Full system access and management
- **Teacher**: Course and student management, grading, attendance
- **Student**: View courses, submit assignments, view grades
- **Parent**: View child's performance and information
- **Staff**: Administrative support functions

## Default Credentials

After setting up the database, a default admin account is created:
- Username: `admin`
- Password: `admin123`
- Email: `admin@akili.school`

**⚠️ SECURITY WARNING**: Change these credentials immediately in production!

## Development

```bash
# Install dependencies
npm install

# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run production build
npm start
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Protected API endpoints
- SQL injection prevention via parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Roadmap

- [ ] Student portal web interface
- [ ] Teacher portal web interface
- [ ] Parent portal
- [ ] Mobile applications (iOS/Android)
- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] Grade book with GPA calculation
- [ ] Timetable/Schedule management
- [ ] Library management
- [ ] Exam management system
- [ ] Certificate generation
- [ ] Multi-language support (French, English)

## License

Copyright © 2026 Akili School. All rights reserved.

## Support

For support, please contact: admin@akili.school

