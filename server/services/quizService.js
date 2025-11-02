import { getGroqResponse } from './groqService.js';

export async function generateQuiz(text, options = {}) {
  const {
    numQuestions = 5,
    questionType = 'mixed',
    difficulty = 'medium' 
  } = options;

  const questionTypeInstructions = questionType === 'multiple-choice' 
    ? 'Generate only multiple-choice questions with 4 options each and clearly mark the correct answer.'
    : questionType === 'short-answer'
    ? 'Generate only short-answer questions that require brief written responses.'
    : 'Generate a mix of multiple-choice questions (with 4 options each) and short-answer questions.';

  const prompt = `You are SmartStudy AI — an intelligent study assistant.

Generate ${numQuestions} well-structured quiz questions from the following text. 

Requirements:
- ${questionTypeInstructions}
- Difficulty level: ${difficulty}
- Cover both factual information and conceptual understanding
- Questions should test comprehension, not just memorization
- For multiple-choice: Include 4 options, clearly mark the correct answer with (Correct) or [Correct Answer]
- Format questions clearly with numbers and proper structure
- Include a brief explanation or hint where appropriate

Text content:
${text}

Please generate the quiz in the following JSON format:
{
  "questions": [
    {
      "type": "multiple-choice" or "short-answer",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"] (only for multiple-choice),
      "correctAnswer": "Correct answer text",
      "explanation": "Brief explanation"
    }
  ]
}

Return ONLY valid JSON, no additional text:`;

  try {
    const response = await getGroqResponse(prompt);
 
    let jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const quizData = JSON.parse(jsonMatch[0]);
      return quizData;
    } else {

      const quizData = JSON.parse(response);
      return quizData;
    }
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
}

export default { generateQuiz };

