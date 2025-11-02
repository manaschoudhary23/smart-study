import { generateQuiz } from '../services/quizService.js';

export async function createQuiz(req, res, next) {
  try {
    const { text, numQuestions, questionType, difficulty } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const quiz = await generateQuiz(text, {
      numQuestions: numQuestions || 5,
      questionType: questionType || 'mixed',
      difficulty: difficulty || 'medium'
    });

    res.json({
      success: true,
      quiz: quiz
    });
  } catch (error) {
    next(error);
  }
}

export default { createQuiz };

