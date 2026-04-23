import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeCode = async (code, language) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest" 
  });

  const prompt = `
You are a code reviewer AI.

Analyze the following ${language} code and respond ONLY in JSON format:

{
  "bugs": "",
  "improvements": "",
  "complexity": "",
  "refactoredCode": ""
}

Code:
${code}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};