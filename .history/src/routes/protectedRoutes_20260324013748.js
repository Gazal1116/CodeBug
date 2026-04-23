import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// protected test route
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.userId
  });
});

export default router;