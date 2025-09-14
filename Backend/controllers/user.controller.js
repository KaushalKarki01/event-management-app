const Registration = require("../models/registration.model");
const User = require("../models/user.model");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL REGISTRATIONS OF A USER
exports.getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
    }).populate("event", "title location");
    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};
