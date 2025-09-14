const Event = require("../models/event.model");
const Registration = require("../models/registration.model");

// ADMIN - CREATE EVENT
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, location, date, category } = req.body;
    //organizer comes from auto logged user
    const organizer = req.user._id;

    const imagePath = req.file ? req.file.path : "";

    const event = await Event.create({
      title,
      description,
      location,
      date,
      category,
      organizer,
      image: imagePath,
    });
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL EVENTS
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("organizer", "fullname email");
    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

// GET AN EVENT DETAIL
exports.getEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findOne({ _id: eventId }).populate(
      "organizer",
      "fullname email"
    );
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    }
    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - UPDATE EVENT
exports.updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findOne({ _id: eventId });
    if (!event)
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    const eventDetail = {
      ...req.body,
    };
    // image update
    if (req.file) {
      eventDetail.image = req.file.path;
    }
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId },
      eventDetail,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Event updated successfully!",
      event: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN - DELETE EVENT
exports.deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findOne({ _id: eventId });
    if (!event)
      return res.status(404).json({
        success: false,
        message: "Event not found!",
      });
    await Event.findOneAndDelete({ _id: eventId });
    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// USER - REGISTER FOR AN EVENT
exports.registerToEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const event = await Event.findOne({ _id: eventId });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found!" });

    // check if already registered in event
    const existing = await Registration.findOne({
      event: eventId,
      user: userId,
    });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Already registerd for this event" });

    // check if event is housefull
    const count = await Registration.countDocuments({ _id: eventId });
    if (count >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: "Event is full, no more registrations allowed!",
      });
    }

    // else register user
    const registration = await Registration.create({
      event: eventId,
      user: userId,
    });
    res.status(201).json({
      success: true,
      message: "Registered for event successfully!",
      registration,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL REGISTRATIONS OF AN EVENT
exports.getEventRegistrations = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ _id: eventId });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found!" });

    // if found get all attendees of an event
    const attendees = await Registration.find({ event: eventId })
      .populate("event", "title")
      .populate("user", "fullname email");
    res.status(200).json({
      success: true,
      count: attendees.length,
      attendees,
    });
  } catch (error) {
    next(error);
  }
};

// USER - UNREGISTER FROM AN EVENT
exports.unregisterFromEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const registration = await Registration.findOneAndDelete({
      event: eventId,
      user: userId,
    });
    if (!registration)
      return res.status(404).json({
        success: false,
        message: "You are not registered in this event",
      });
    res.status(200).json({
      success: true,
      message: "Successfully unregistered from this event!!",
    });
  } catch (error) {
    next(error);
  }
};
