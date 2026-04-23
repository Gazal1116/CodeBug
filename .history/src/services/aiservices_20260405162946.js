import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const fallbackAnalysis = (code) => ({
  bugs: "AI analysis unavailable",
  improvements: "Try again after configuring Gemini properly",
  complexity: "Unknown",
  refactoredCode: code
});

const extractJson = (text) => {
  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleanedText);
};

export const analyzeCode = async (code, language) => {
  if (!genAI) {
    console.warn("GEMINI_API_KEY is missing. Using fallback analysis.");
    return fallbackAnalysis(code);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return extractJson(text);
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return fallbackAnalysis(code);
  }
};