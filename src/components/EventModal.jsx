import React, { useState, useEffect } from "react";
import EventForm from "./EventForm"; 

const EventModal = ({ selectedDate, event, closeModal, refreshEvents }) => {
  const [isEditing, setIsEditing] = useState(false); 
  useEffect(() => {
    if (event) {
      setIsEditing(true); 
    } else {
      setIsEditing(false); 
    }
  }, [event]); 

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">

      <div className="bg-white p-4 rounded-md w-96">
        <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>{" "}

        <EventForm
          selectedDate={event ? new Date(event.date) : selectedDate} 
          event={event} 
          closeModal={closeModal} 
          refreshEvents={refreshEvents} 
        />
        <button
          onClick={closeModal} 
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Close 
        </button>
      </div>
    </div>
  );
};

export default EventModal; 
