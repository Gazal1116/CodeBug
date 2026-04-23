import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

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
