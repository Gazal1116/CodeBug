import prisma from "../prisma/prismaClient.js";
import { analyzeCode } from "../services/aiservices.js";

const fallbackReview = (codeSnippet) => ({
  bugs: "AI analysis unavailable",
  improvements: "Please retry later",
  complexity: "Unknown",
  refactoredCode: codeSnippet
});

const parseAiJson = (aiResponse) => {
  if (!aiResponse) {
    return null;
  }

  try {
    return JSON.parse(aiResponse);
  } catch {
    const match = aiResponse.match(/\{[\s\S]*\}/);
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

export const createReview = async (req, res) => {
  try {
    const { codeSnippet, language } = req.body;

    if (!codeSnippet || !language) {
      return res.status(400).json({
        message: "codeSnippet and language are required"
      });
    }


    let parsed = fallbackReview(codeSnippet);

    try {
      const aiResponse = await analyzeCode(codeSnippet, language);
      const aiParsed = parseAiJson(aiResponse);

      if (aiParsed) {
        parsed = { ...parsed, ...aiParsed };
      } else {
        console.log("AI JSON parse fallback used");
      }
    } catch (aiError) {
      console.log("AI analyze fallback used:", aiError.message);
    }

    const review = await prisma.review.create({
      data: {
        codeSnippet,
        language,
        bugs: parsed.bugs || "Not provided",
        improvements: parsed.improvements || "Not provided",
        complexity: parsed.complexity || "Not provided",
        refactoredCode: parsed.refactoredCode || codeSnippet,
        userId: req.userId
      }
    });

    res.status(201).json({
      message: "Review created successfully",
      review
    });

  } catch (error) {
    console.log("Review error:", error);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
};