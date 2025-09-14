const { Router } = require("express");
const { protect, isAdmin } = require("../middlewares/authProtect.middleware");
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerToEvent,
  unregisterFromEvent,
  getEventRegistrations,
} = require("../controllers/event.controller");
const eventRouter = Router();
const upload = require("../middlewares/upload.middleware");

//1. CREATE AN EVENT
eventRouter.post("/", protect, isAdmin, upload.single("image"), createEvent);

// GET ALL EVENTS
eventRouter.get("/", getAllEvents);

// GET AN EVENT
eventRouter.get("/:id", getEvent);

// UPDATE AN EVENT
eventRouter.put("/:id", protect, isAdmin, updateEvent);

// DELETE AN EVENT
eventRouter.delete("/:id", protect, isAdmin, deleteEvent);

// REGISTER TO AN EVENT
eventRouter.post("/:eventId/register", protect, registerToEvent);

// GET ALL ATTENDEES OF AN EVENT
eventRouter.get(
  "/:eventId/registrations",
  protect,
  isAdmin,
  getEventRegistrations
);

// UNREGISTER FROM AN EVENT
eventRouter.post("/:eventId/unregister", protect, unregisterFromEvent);

module.exports = eventRouter;
