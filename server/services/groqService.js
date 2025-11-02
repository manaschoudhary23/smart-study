import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, 
});

export async function getGroqResponse(prompt, options = {}) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are SmartStudy AI — an intelligent study assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: options.model || "llama-3.3-70b-versatile",
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048,
      top_p: options.topP || 1,
      stream: false,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error(`Failed to get response from Groq: ${error.message}`);
  }
}
