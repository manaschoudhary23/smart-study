import express from 'express';
import quizController from '../controllers/quizController.js';

const router = express.Router();

router.post('/generate', quizController.createQuiz);

export default router;

