const crypto = require("crypto");
const User = require("../models/user.model");
const sendMail = require("../utils/sendMail.utils");
const { generateAccessToken } = require("../utils/token.utils");

exports.signUp = async (req, res, next) => {
  const { fullname, email, password, role } = req.body;
  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // if not, create user
    const user = await User.create({ fullname, email, password, role });
    const accessToken = await generateAccessToken(user);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({
      success: true,
      message: "User created successfully",
      token: accessToken,
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields",
    });
  }
  try {
    //check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    // if user exists compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    const accessToken = await generateAccessToken(user);
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({
      success: true,
      message: "Log in successful",
      token: accessToken,
      data: userObj,
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // generate reset token and save hashed version to db
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //reset url
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    //send email
    await sendMail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset./n Click here to reset your password: ${resetUrl}/n If you did not request this, please ignore this email.`,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link sent your email.",
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    // hash token to compare it with token in db
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    //find user by token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or token expired" });

    // set new password and clear token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    next(error);
  }
};
