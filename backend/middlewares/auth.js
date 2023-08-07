const user = require("../models/user");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if (!token) {
      res.status(402).json({
        message: "please Login First",
      });
    }
    if (!decoded || !decoded._id) {
      return res.status(402).json({
        message: "Invalid token. Please Login Again.",
      });
    }

    req.user = await user.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
