import React, { useState } from "react";
import EventForm from "./EventForm"; // Import your EventForm component
import useFetchEvents from "../hooks/useFetchEvents"; // Import your custom hook
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EventList = () => {
  const { events, fetchEvents } = useFetchEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${BACKEND_URL}/deleteEvents/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Event deleted successfully!");
      fetchEvents(); // Refresh events after deletion
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Your Events
        </h2>
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event._id}
              className="flex flex-col justify-between p-4 border rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <div>
                <strong className="text-xl text-gray-800">{event.title}</strong>
                <p className="text-gray-700">{event.description}</p>
                <p className="text-gray-500">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => openModal(event)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <EventForm
                selectedDate={new Date(selectedEvent.date)}
                event={selectedEvent}
                closeModal={closeModal}
                refreshEvents={fetchEvents}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
