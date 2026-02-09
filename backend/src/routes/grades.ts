import { Router } from 'express';
import { GradeModel } from '../models/Grade';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get grades for a student
router.get('/student/:studentId', authenticate, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    
    // Students can only view their own grades
    if (req.user?.role === 'student') {
      // TODO: Validate student owns this ID
    }
    
    const grades = await GradeModel.findByStudent(studentId);
    res.json({ grades, count: grades.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Get grades for a student in a specific course
router.get('/student/:studentId/course/:courseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const courseId = parseInt(req.params.courseId);
    
    const grades = await GradeModel.findByStudentAndCourse(studentId, courseId);
    const average = await GradeModel.calculateCourseAverage(studentId, courseId);
    
    res.json({ grades, average, count: grades.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Get all grades for a course (teacher/admin only)
router.get('/course/:courseId', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const grades = await GradeModel.findByCourse(courseId);
    res.json({ grades, count: grades.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

// Create a new grade (teacher/admin only)
router.post('/', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const grade = await GradeModel.create({
      student_id: req.body.student_id,
      course_id: req.body.course_id,
      assignment_id: req.body.assignment_id,
      grade_value: req.body.grade_value,
      grade_letter: req.body.grade_letter,
      weight: req.body.weight || 1.0,
      graded_by: parseInt(req.user!.id)
    });

    res.status(201).json(grade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create grade' });
  }
});

// Update a grade (teacher/admin only)
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const grade = await GradeModel.update(id, req.body);
    
    if (!grade) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json(grade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update grade' });
  }
});

// Delete a grade (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await GradeModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grade' });
  }
});

export default router;
