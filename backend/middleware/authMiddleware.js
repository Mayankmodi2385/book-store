const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;               // Get authorization header

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. No token provided."
      });
    }

    
    const token = authHeader.split(" ")[1];                     // Get token from "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Invalid token format."
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store user information in request
    req.user = decoded;

    // Continue to controller
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;