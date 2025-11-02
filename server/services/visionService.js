import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeImageBuffer(imageBuffer, mimeType, question, context = "") {
  try {
    console.log("Starting image analysis...");
    console.log("Image size:", imageBuffer.length, "bytes");
    console.log("MIME type:", mimeType);

  const VISION_MODEL = process.env.GEMINI_VISION_MODEL || 'gemini-2.0-flash';
  const model = genAI.getGenerativeModel({ model: VISION_MODEL });
    const base64Image = imageBuffer.toString("base64");

    const contextPrompt = context ? `\nAdditional Context: ${context}` : '';
    const prompt = `You are SmartStudy AI — an intelligent study assistant specializing in visual analysis.

When analyzing images, you should:
- Carefully identify all objects, text labels, diagrams, or relationships shown
- Understand the user's question or task
- Perform necessary reasoning or calculations
- Provide clear, step-by-step explanations
- Use equations or formulas where relevant
- Format responses with headings, bullet points, and examples when helpful
- Be educational and structured in your response

Question: ${question}${contextPrompt}

Please analyze the image and provide a comprehensive answer:`;

    console.log("Sending request to Gemini...");
    
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: mimeType, data: base64Image } },
    ]);

    console.log("Received response from Gemini");
    
    const response = await result.response;
    if (!response) {
      throw new Error("No response received from Gemini");
    }
    
    const text = response.text();
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    console.log("Analysis complete. Response length:", text.length);
    return text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    const notFoundMsgs = ['not found', 'is not found', 'not supported', 'unknown name'];
    const messageLower = (error.message || '').toLowerCase();
    if (error?.code === 404 || notFoundMsgs.some(m => messageLower.includes(m))) {
      try {
        if (typeof genAI.listModels === 'function') {
          const models = await genAI.listModels();
          console.error('Available models (server):', models);
        } else if (typeof genAI.getModels === 'function') {
          const models = await genAI.getModels();
          console.error('Available models (server):', models);
        } else {
          console.error('List models API not available on this SDK instance');
        }
      } catch (listErr) {
        console.error('Failed to list models for diagnostics:', listErr);
      }

      throw new Error(`Model ${process.env.GEMINI_VISION_MODEL || VISION_MODEL} not available for generateContent. Set GEMINI_VISION_MODEL to a supported model for your API key (see server logs for available models). Original error: ${error.message}`);
    }

    throw new Error("Failed to analyze image: " + (error.message || "Unknown error"));
  }
}
