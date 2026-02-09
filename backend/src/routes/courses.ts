import { Router } from 'express';
import { CourseModel } from '../models/Course';
import { EnrollmentModel } from '../models/Enrollment';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all courses
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const courses = await CourseModel.findAll(limit, offset);
    res.json({ courses, count: courses.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const course = await CourseModel.findById(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Get enrollments for a course
router.get('/:id/enrollments', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const enrollments = await EnrollmentModel.findByCourse(courseId);
    res.json({ enrollments, count: enrollments.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// Create new course (admin/teacher only)
router.post('/', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const course = await CourseModel.create({
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      teacher_id: req.body.teacher_id,
      credits: req.body.credits,
      level: req.body.level,
      subject: req.body.subject,
      start_date: new Date(req.body.start_date),
      end_date: new Date(req.body.end_date),
      status: req.body.status || 'draft',
      max_students: req.body.max_students
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update course (admin/teacher only)
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const course = await CourseModel.update(id, req.body);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete course (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await CourseModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Enroll student in course
router.post('/:id/enroll', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const courseId = parseInt(req.params.id);
    const { student_id } = req.body;

    const enrollment = await EnrollmentModel.create({
      student_id,
      course_id: courseId,
      enrollment_date: new Date(),
      status: 'enrolled'
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll student' });
  }
});

export default router;
