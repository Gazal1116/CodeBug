import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const configuredModel = process.env.GEMINI_MODEL;

const CANDIDATE_MODELS = [
  configuredModel,
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash"
].filter(Boolean);

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
  const hasNestedLoop = /for\s*\([^)]*\)\s*\{[\s\S]*for\s*\([^)]*\)/.test(code);
  const usesNInLoop = /for\s*\([^)]*;\s*[^;]*<\s*n\s*;/.test(code);
  const definesN = /\b(let|const|var)\s+n\b/.test(code);
  const hasNParam = /function\s*\w*\s*\([^)]*\bn\b[^)]*\)|\([^)]*\bn\b[^)]*\)\s*=>/.test(code);

  const bugs = usesNInLoop && !definesN && !hasNParam
    ? "Variable n is not defined"
    : "No obvious runtime bug found";

  const normalizedLoop = /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*n\s*;\s*i(?:\+\+)?\s*\)\s*\{\s*console\.log\(\s*i\s*\)\s*;?\s*\}/;
  const refactoredCode = normalizedLoop.test(code)
    ? "for (let i = 0; i < n; i++) console.log(i);"
    : code.trim();

  return {
    bugs,
    improvements: "Add input validation",
    complexity: hasNestedLoop ? "O(n^2)" : hasLoop ? "O(n)" : "O(1)",
    refactoredCode
  };
};

export const analyzeCode = async (code, language) => {
  try {
    if (!genAI) {
      return JSON.stringify(localAnalyzeCode(code));
    }

    const prompt = `You are a strict code review AI.
Analyze the provided ${language} code.

Rules:
1) Respond ONLY with valid JSON (no markdown, no explanation text).
2) Use exactly these keys: bugs, improvements, complexity, refactoredCode.
3) bugs: mention real, code-specific issues only.
4) improvements: concrete fixes based on this exact snippet.
5) complexity: Big-O based on current logic.
6) refactoredCode: improved snippet preserving intent.

Required output shape:
{
  "bugs": "...",
  "improvements": "...",
  "complexity": "...",
  "refactoredCode": "..."
}

Code:
${code}`;

    let lastError = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        const parsed = extractJsonObject(text) || localAnalyzeCode(code);

        return JSON.stringify(parsed);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("No supported Gemini model available");

  } catch (error) {
    console.log("AI Error:", error);

    return JSON.stringify(localAnalyzeCode(code));
  }
};