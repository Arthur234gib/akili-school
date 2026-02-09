import { Router } from 'express';
const router = Router();

router.post('/scan', async (req, res) => {
  const { uid, readerId } = req.body;
  res.json({ status: 'ok', uid, readerId });
});

export default router;

