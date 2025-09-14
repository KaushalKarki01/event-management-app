const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please provide token.",
      });
    }
    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized:Invalid or expired token.",
    });
  }
};

// check if user if admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(401).json({
        success: false,
        message: "Access denied!! Admins only",
      });
    }
  } catch (error) {
    next(error);
  }
};
