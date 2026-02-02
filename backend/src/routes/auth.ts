import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ sub: username }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '8h' });
    return res.json({ token });
  }
  res.status(400).json({ error: 'username/password required' });
});

export default router;
