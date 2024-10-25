import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api/v1";


const EventForm = ({ selectedDate, event, closeModal, refreshEvents }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(""); // New state for time

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      // Set time from event date
      setTime(new Date(event.date).toISOString().substring(11, 16)); // Get time in HH:mm format
    } else {
      setTime(""); // Reset time for new event
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine the selected date with the selected time
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(time.split(":")[0]); // Set the hours from the time input
    selectedDateTime.setMinutes(time.split(":")[1]); // Set the minutes from the time input

    // console.log(selectedDate)

    const eventData = {
      title,
      description,
      date: selectedDateTime, // Use the combined date and time
    };

    try {
      if (event) {
        await axios.put(`${BACKEND_URL}/updateEvents/${event._id}`, eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Event updated successfully!");
      } else {
        await axios.post(`${BACKEND_URL}/createEvents`, eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Event created successfully!");
      }
      refreshEvents();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the event.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/deleteEvents/${event._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Event deleted successfully!");
      refreshEvents();
      closeModal();
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the event.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title:</label>
        <input
          type="text"
          className="border w-full p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          className="border w-full p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Time:</label> {/* Time label */}
        <input
          type="time"
          className="border w-full p-2"
          value={time}
          onChange={(e) => setTime(e.target.value)} // Update time state
          required
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        {event ? "Update" : "Create"} Event
      </button>
      {event && (
        <button
          type="button"
          onClick={handleDelete}
          className="mt-4 ml-4 bg-red-500 text-white p-2 rounded"
        >
          Delete Event
        </button>
      )}
    </form>
  );
};

export default EventForm;
