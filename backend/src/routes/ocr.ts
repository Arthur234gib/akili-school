import { Router } from 'express';
import multer from 'multer';
const upload = multer({ dest: '/tmp/uploads' });
const router = Router();

router.post('/upload', upload.array('file'), async (req, res) => {
  const files = (req.files || []).length;
  res.json({ status: 'queued', files });
});

export default router;
