import prisma from "../prisma/prismaClient.js";

export const createReview = async (req, res) => {
  try {
    const { codeSnippet, language } = req.body;

    // fake AI response (for now)
    const bugs = "No major bugs found";
    const improvements = "Improve variable naming";
    const complexity = "O(n)";
    const refactoredCode = codeSnippet;

    const review = await prisma.review.create({
      data: {
        codeSnippet,
        language,
        bugs,
        improvements,
        complexity,
        refactoredCode,
        userId: req.userId
      }
    });

    res.status(201).json({
      message: "Review created",
      review
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};