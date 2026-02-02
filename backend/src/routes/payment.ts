import { Router } from 'express';
const router = Router();

router.post('/charge', async (req, res) => {
  const { amount, currency = 'XAF', method } = req.body;
  return res.json({ status: 'ok', provider: 'mock', amount, currency, method, transactionId: `mock_${Date.now()}` });
});

router.post('/webhook', async (req, res) => {
  res.status(200).send('ok');
});

export default router;
