const jwt = require("jsonwebtoken");

exports.generateAccessToken = async (user) => {
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};
