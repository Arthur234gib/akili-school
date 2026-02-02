import { Router } from 'express';
const router = Router();

router.post('/push', async (req, res) => res.json({ status: 'pushed' }));
router.get('/pull', async (req, res) => res.json({ changes: [] }));

export default router;
