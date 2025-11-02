import pdfParse from 'pdf-parse';
import fs from 'fs/promises';
import { getGroqResponse } from './groqService.js';

export async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

export async function summarizeText(text) {
  const prompt = `You are SmartStudy AI — an intelligent study assistant.

Please analyze the following text and provide a clear, concise summary. Focus on:
- Key concepts and main ideas
- Important facts and definitions
- Logical structure and flow

Text to summarize:
${text}

Provide a well-structured summary with headings and bullet points where appropriate:`;

  try {
    const summary = await getGroqResponse(prompt);
    return summary;
  } catch (error) {
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

export async function explainConcepts(text, topic = null) {
  const topicContext = topic ? `Focus specifically on: ${topic}\n\n` : '';
  
  const prompt = `You are SmartStudy AI — an intelligent study assistant that helps students learn effectively.

${topicContext}Please explain the following content in a clear, beginner-friendly manner:
- Use simple language and avoid jargon when possible
- Provide analogies and real-life examples where helpful
- Break down complex topics into digestible parts
- Use headings, bullet points, and examples for clarity

Content to explain:
${text}

Provide a structured explanation:`;

  try {
    const explanation = await getGroqResponse(prompt);
    return explanation;
  } catch (error) {
    throw new Error(`Failed to generate explanation: ${error.message}`);
  }
}

export default { extractTextFromPDF, summarizeText, explainConcepts };

