import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import authRouter from './routes/auth';
import paymentRouter from './routes/payment';
import syncRouter from './routes/sync';
import ocrRouter from './routes/ocr';
import nfcRouter from './routes/nfc';
import logger from './lib/logger';

dotenv.config();
const app = express();
app.use(cors());
app.use(json());

app.get('/health', (_, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'dev' }));

app.use('/api/auth', authRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/sync', syncRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/nfc', nfcRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`AKILI Backend listening on ${port}`);
});
