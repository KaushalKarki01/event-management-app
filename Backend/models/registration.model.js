// EVENT REGISTRATION SCHEMA
const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// prevent duplicate registration for the same event by the same user
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
