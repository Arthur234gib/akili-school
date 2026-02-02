import { Router } from 'express';
const router = Router();

router.post('/scan', async (req, res) => {
  const { uid, readerId } = req.body;
  res.json({ status: 'ok', uid, readerId });
});

export default router;

cat > backend/src/lib/logger.ts <<'EOF'
import winston from 'winston';
const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console({ format: winston.format.simple() })]});
export default logger;
