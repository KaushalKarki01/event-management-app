const { Router } = require("express");
const {
  getAllUsers,
  getUser,
  getAllRegistrations,
} = require("../controllers/user.controller");
const { protect, isAdmin } = require("../middlewares/authProtect.middleware");
const userRouter = Router();

userRouter.get("/", protect, isAdmin, getAllUsers);
userRouter.get("/:id", protect, isAdmin, getUser);

// GET USER'S EVENT REGISTATIONS
userRouter.get("/me/registrations", protect, getAllRegistrations);

module.exports = userRouter;
