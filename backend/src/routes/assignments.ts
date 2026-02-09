import { Router } from 'express';
import { AssignmentModel } from '../models/Assignment';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all assignments
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const assignments = await AssignmentModel.findAll(limit, offset);
    res.json({ assignments, count: assignments.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get assignment by ID
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const assignment = await AssignmentModel.findById(id);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Get assignments by course
router.get('/course/:courseId', authenticate, async (req: AuthRequest, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const assignments = await AssignmentModel.findByCourse(courseId);
    res.json({ assignments, count: assignments.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Create new assignment (admin/teacher only)
router.post('/', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const assignment = await AssignmentModel.create({
      course_id: req.body.course_id,
      title: req.body.title,
      description: req.body.description,
      due_date: new Date(req.body.due_date),
      max_points: req.body.max_points,
      type: req.body.type,
      status: req.body.status || 'draft'
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Update assignment (admin/teacher only)
router.put('/:id', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const assignment = await AssignmentModel.update(id, req.body);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete assignment (admin/teacher only)
router.delete('/:id', authenticate, authorize('admin', 'teacher'), async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await AssignmentModel.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;
