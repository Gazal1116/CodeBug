import express from "express";
import authRoutes from "./routes/authRoutes";

const app = express();

// middleware
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Server is running ");
});

app.use("/api/auth", authRoutes);

// server start
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
