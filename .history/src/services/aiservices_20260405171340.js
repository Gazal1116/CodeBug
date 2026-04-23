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

export const analyzeCode = async (code, language) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a code reviewer. Respond ONLY in JSON."
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

    return response.choices[0].message.content;

  } catch (error) {
    console.log("API KEY:", process.env.OPENAI_API_KEY);;

    // fallback (VERY IMPORTANT)
    return JSON.stringify({
      bugs: "AI failed",
      improvements: "Try again",
      complexity: "Unknown",
      refactoredCode: code
    });
  }
};