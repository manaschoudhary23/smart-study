import express from 'express';
import fileUpload from 'express-fileupload';
import pdfController from '../controllers/pdfController.js';

const router = express.Router();

router.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true
}));

router.post('/upload', pdfController.uploadPDF);
router.post('/summarize', pdfController.summarize);
router.post('/explain', pdfController.explain);

export default router;

