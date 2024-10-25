const express = require("express");
const authenticateUser = require("./middleware/authenticateUser");
const {
  signUp,
  login,
} = require("./controllers/Auth");

const { createEvent, getEvents, updateEvent, deleteEvent } = require("./controllers/Calendar");

const router = express.Router();

router.post("/auth/signup", signUp);
router.post("/auth/login", login);

// Protected routes (require token)
router.post("/createEvents", authenticateUser, createEvent);
router.get("/allEvents", authenticateUser, getEvents);
router.put("/updateEvents/:id", authenticateUser, updateEvent);
router.delete("/deleteEvents/:id", authenticateUser, deleteEvent);

module.exports = router;
