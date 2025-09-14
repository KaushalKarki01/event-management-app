const { Router } = require("express");
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const authRouter = Router();
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

module.exports = authRouter;
