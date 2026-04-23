import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const fallbackToken = req.headers["x-access-token"];

    if (!authHeader && !fallbackToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Support both "Authorization: Bearer <token>" and raw token headers.
    const rawToken = authHeader || fallbackToken;
    const token = rawToken.startsWith("Bearer ")
      ? rawToken.slice(7).trim()
      : rawToken.trim();

    if (!token) {
      return res.status(401).json({ message: "Token format is invalid" });
    }

    const jwtSecret = process.env.JWT_SECRET || "secretkey";
    const decoded = jwt.verify(token, jwtSecret);

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return;
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;