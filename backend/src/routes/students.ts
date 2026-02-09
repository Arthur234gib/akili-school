import { Router } from 'express';
import { StudentModel } from '../models/Student';
import { UserModel } from '../models/User';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcrypt';

const router = Router();

// Get all students (admin/teacher only)
router.get('/', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const students = await StudentModel.findAll(limit, offset);
    res.json({ students, count: students.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const student = await StudentModel.findById(id);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Students can only view their own data
    if (req.user?.role === 'student') {
      const userStudent = await StudentModel.findByUserId(parseInt(req.user.id));
      if (!userStudent || userStudent.id !== student.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create new student (admin only)
router.post('/', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const { username, email, password, first_name, last_name, phone, ...studentData } = req.body;

    // Create user account first
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      email,
      password_hash: passwordHash,
      role: 'student',
      first_name,
      last_name,
      phone
    });

    // Create student record
    const student = await StudentModel.create({
      user_id: user.id!,
      student_number: studentData.student_number,
      date_of_birth: new Date(studentData.date_of_birth),
      gender: studentData.gender,
      address: studentData.address,
      parent_name: studentData.parent_name,
      parent_phone: studentData.parent_phone,
      parent_email: studentData.parent_email,
      enrollment_date: new Date(studentData.enrollment_date || Date.now()),
      status: studentData.status || 'active'
    });

    res.status(201).json({ student, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update student (admin only)
router.put('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const student = await StudentModel.update(id, req.body);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete student (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await StudentModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
