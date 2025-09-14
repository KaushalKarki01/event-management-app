const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Event title is required"],
      minLength: [5, "Event title must be at least 5 characters long"],
      maxLength: [100, "Event title must be less than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Event must be described"],
      minLength: [20, "Event description must be at least 20 characters long"],
    },
    location: {
      type: String,
      trim: true,
      required: [true, "Please provide event location"],
    },
    date: {
      type: Date,
      required: [true, "Please provide event date"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ref to admin
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    image: {
      type: String,
      default: "",
    },
    capacity: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
