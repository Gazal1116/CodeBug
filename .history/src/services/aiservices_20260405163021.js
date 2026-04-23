import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeCode = async (code, language) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are a code reviewer.

Analyze this ${language} code and respond in JSON format:

{
  "bugs": "...",
  "improvements": "...",
  "complexity": "...",
  "refactoredCode": "..."
}

Code:
${code}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text;
};