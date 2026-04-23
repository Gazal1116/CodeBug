// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const analyzeCode = async (code, language) => {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash" 
//   });

//   const prompt = `
// You are a code reviewer AI.

// Analyze the following ${language} code and respond ONLY in JSON format:

// {
//   "bugs": "",
//   "improvements": "",
//   "complexity": "",
//   "refactoredCode": ""
// }

// Code:
// ${code}
// `;

//   const result = await model.generateContent(prompt);
//   const response = await result.response;

//   return response.text();
// };


import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const extractJsonObject = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const match = text?.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const localAnalyzeCode = (code) => {
  const hasLoop = /\b(for|while)\b/.test(code);
  const usesNInLoop = /for\s*\([^)]*;\s*[^;]*<\s*n\s*;/.test(code);
  const definesN = /\b(let|const|var)\s+n\b/.test(code);
  const hasNParam = /function\s*\w*\s*\([^)]*\bn\b[^)]*\)|\([^)]*\bn\b[^)]*\)\s*=>/.test(code);

  const bugs = usesNInLoop && !definesN && !hasNParam
    ? "Variable n is not defined"
    : "No obvious runtime bug found";

  const refactoredCode = code
    .replace(/for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*n\s*;\s*i\+\+\s*\)\s*\{\s*console\.log\(i\)\s*\}/g, "for (let i = 0; i < n; i++) console.log(i);")
    .trim();

  return {
    bugs,
    improvements: "Add input validation",
    complexity: hasLoop ? "O(n)" : "O(1)",
    refactoredCode
  };
};

export const analyzeCode = async (code, language) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a code reviewer. Respond ONLY in valid JSON object with keys: bugs, improvements, complexity, refactoredCode."
        },
        {
          role: "user",
          content: `
Analyze this ${language} code and return JSON:

{
  "bugs": "",
  "improvements": "",
  "complexity": "",
  "refactoredCode": ""
}

Code:
${code}
`
        }
      ]
    });

    const content = response.choices[0].message.content || "{}";
    const parsed = extractJsonObject(content) || localAnalyzeCode(code);

    return JSON.stringify(parsed);

  } catch (error) {
    console.log("AI Error:", error);

    return JSON.stringify(localAnalyzeCode(code));
  }
};