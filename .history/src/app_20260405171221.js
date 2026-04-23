import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
{
    "message": "Review created successfully",
    "review": {
        "id": "8a377ab4-521b-4c3a-8003-a43530a5ee1d",
        "language": "javascript",
        "codeSnippet": "for(let i=0;i<n;i++){console.log(i)}",
        "bugs": "AI unavailable",
        "improvements": "Try again later",
        "complexity": "Unknown",
        "refactoredCode": "for(let i=0;i<n;i++){console.log(i)}",
        "createdAt": "2026-04-05T11:39:26.939Z",
        "updatedAt": "2026-04-05T11:39:26.939Z",
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running ");
});

app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", reviewRoutes);
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
