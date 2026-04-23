import prisma from "../prisma/prismaClient.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== "string" || !password || typeof password !== "string") {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // If user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: "User created successfully",
      user
    });

  } catch (error) {
    console.error(error);
    const dev = process.env.NODE_ENV !== "production";
    res.status(500).json({
      message: dev ? error.message : "Something went wrong",
      ...(dev && error.code ? { code: error.code } : {})
    });
  }
};