import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secretkey");
    const declare = jwt.verify(token,"secretKey");
    return res.status(200).json

    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;