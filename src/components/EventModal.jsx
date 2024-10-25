import React, { useState, useEffect } from "react";
import EventForm from "./EventForm"; // EventForm component ko import kar rahe hain

const EventModal = ({ selectedDate, event, closeModal, refreshEvents }) => {
  const [isEditing, setIsEditing] = useState(false); // Editing mode ko track karne ke liye state

  // Effect hook ka use karke event ke change hone par editing mode update karna
  useEffect(() => {
    if (event) {
      setIsEditing(true); // Agar event hai to editing mode on karna
    } else {
      setIsEditing(false); // Agar event nahi hai to editing mode off karna
    }
  }, [event]); // Jab event change ho to ye effect chalega

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      {/* Modal background */}
      <div className="bg-white p-4 rounded-md w-96">
        <h2>{isEditing ? "Edit Event" : "Add Event"}</h2>{" "}
        {/* Title set karna */}
        <EventForm
          selectedDate={event ? new Date(event.date) : selectedDate} // Selected date pass karna
          event={event} // Event details pass karna agar editing mode mein hain
          closeModal={closeModal} // Modal close karne ka function pass karna
          refreshEvents={refreshEvents} // Events refresh karne ka function pass karna
        />
        <button
          onClick={closeModal} // Close button click hone par modal close hoga
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Close 
        </button>
      </div>
    </div>
  );
};

export default EventModal; // EventModal component export karna
