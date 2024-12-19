const jwt = require("jsonwebtoken");
const repo = require("../db/repositories/userRepository");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);

    // Check if Authorization header is present and starts with Bearer or JWT
    if (
      !authHeader ||
      !(authHeader.startsWith("Bearer ") || authHeader.startsWith("JWT "))
    ) {
      return res.status(403).json({ message: "Invalid or missing JWT token" });
    }

    // Extract the token (considering both Bearer and JWT prefix)
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from the database
    const user = await repo.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Attach user info to request and move to the next middleware/controller
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid JWT token" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = authenticate;
