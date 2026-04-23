import prisma from "../prisma/prismaClient.js";
import { analyzeCode } from "../services/aiservices.js";

export const createReview = async (req, res) => {
  try {
    const { codeSnippet, language } = req.body;

    if (!codeSnippet || !language) {
      return res.status(400).json({
        message: "codeSnippet and language are required"
      });
    }


    const parsed = await analyzeCode(codeSnippet, language);

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