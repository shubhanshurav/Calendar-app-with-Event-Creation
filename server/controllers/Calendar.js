const Calendar = require("../models/Calendar");

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create new event
    const event = new Calendar({
      title,
      description,
      date: new Date(date), // Ensure date is a Date object
      userId: req.user._id,
    });

    await event.save();
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
};


// Get All Events for Logged-in User
exports.getEvents = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure user is authenticated
    const allEvents = await Calendar.find({ userId });

    if (!allEvents || allEvents.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No events found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events: allEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
};


// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Calendar.findOneAndUpdate(
      { _id: id, userId: req.user.id }, // Ensure the user is the owner
      req.body,
      { new: true } // Return the updated event
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found or user unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      updatedEvent,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
    });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Calendar.findOneAndDelete({
      _id: id,
      userId: req.user.id, // Ensure the user is the owner
    });

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found or user unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
};
