import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeImage(imagePath, question) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const imageBytes = fs.readFileSync(imagePath).toString("base64");

    const result = await model.generateContent([
      { text: question },
      { inlineData: { mimeType: "image/png", data: imageBytes } },
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw new Error("Failed to analyze image: " + error.message);
  }
}
