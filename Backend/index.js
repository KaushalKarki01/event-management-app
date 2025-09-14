const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config({ path: "./.env" });
const authRouter = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");
const eventRouter = require("./routes/event.routes");
const userRouter = require("./routes/user.routes");
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Event Management System API!!! 🚀🚀");
});

// Error handling middleware
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Event management server is running on port ${PORT} on ${process.env.NODE_ENV} mode`
      );
    });
  })
  .catch((err) => {
    console.log(`Failed to connect to the database:${err.message}`);
    process.exit(1); // Exit the process with failure
  });
