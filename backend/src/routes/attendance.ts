import { Router } from 'express';
import { AttendanceModel } from '../models/Attendance';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get attendance by student and course
router.get('/student/:studentId/course/:courseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const studentId = parseInt(req.params.studentId);
    const courseId = parseInt(req.params.courseId);
    const attendance = await AttendanceModel.findByStudentAndCourse(studentId, courseId);
    res.json({ attendance, count: attendance.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Get attendance for a course on a specific date
router.get('/course/:courseId/date/:date', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const date = new Date(req.params.date);
    const attendance = await AttendanceModel.findByCourseAndDate(courseId, date);
    res.json({ attendance, count: attendance.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
});

// Record attendance (admin/teacher only)
router.post('/', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const attendance = await AttendanceModel.create({
      student_id: req.body.student_id,
      course_id: req.body.course_id,
      date: new Date(req.body.date || Date.now()),
      status: req.body.status,
      notes: req.body.notes
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// Update attendance (admin/teacher only)
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const attendance = await AttendanceModel.update(id, req.body);
    
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// Delete attendance (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await AttendanceModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
});

export default router;
