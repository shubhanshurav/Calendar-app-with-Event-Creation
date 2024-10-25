const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate user using JWT
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token to the req.user

    // Optionally, find the user in the database if more information is needed
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next(); // Continue to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

module.exports = authenticateUser;
