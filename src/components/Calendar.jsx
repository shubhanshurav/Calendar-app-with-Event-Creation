import React, { useState, useCallback } from "react";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
} from "date-fns";
import EventModal from "./EventModal";
import useFetchEvents from "../hooks/useFetchEvents";
import { Link } from "react-router-dom";

const Calendar = () => {
 
  const [currentMonth, setCurrentMonth] = useState(new Date()); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [showModal, setShowModal] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState(null); 

  const { events, fetchEvents } = useFetchEvents(currentMonth);

  const onDateClick = useCallback(
    (day) => {
      setSelectedDate(day);
      const dayEvents = events.filter(
        (event) => isSameDay(new Date(event.date), day) 
      );

      if (dayEvents.length === 0) {
        setSelectedEvent(null); 
        setShowModal(true); 
      }
    },
    [events]
  );

  const openModal = useCallback((event) => {
    setSelectedEvent(event); 
    setShowModal(true); 
  }, []);

  const changeMonthYear = (newMonth, newYear) => {
    const newDate = new Date(newYear, newMonth); 
    setCurrentMonth(newDate); 
  };

  const prevMonth = () => setCurrentMonth(addDays(currentMonth, -30));
  const nextMonth = () => setCurrentMonth(addDays(currentMonth, 30));

const renderHeader = () => (
  <div className="flex justify-between items-center mb-4 p-2 bg-blue-600 text-white rounded-lg">
    <button
      onClick={prevMonth}
      className="hover:bg-blue-500 font-bold text-md md:text-2xl p-1 md:p-2 rounded"
    >
      &lt;
    </button>
    <select
      className="bg-blue-600 border border-white text-white rounded md:px-2 py-1 md:mx-2"
      onChange={(e) =>
        changeMonthYear(parseInt(e.target.value), currentMonth.getFullYear())
      }
      defaultValue={currentMonth.getMonth()}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <option key={i} value={i}>
          {format(new Date(2021, i), "MMMM")}
        </option>
      ))}
    </select>
    <select
      className="bg-blue-600 border border-white text-white rounded px-2 py-1 mx-2"
      onChange={(e) =>
        changeMonthYear(currentMonth.getMonth(), parseInt(e.target.value))
      }
      defaultValue={currentMonth.getFullYear()} // Set default to the current year
    >
      {Array.from({ length: 10 }).map((_, i) => {
        const year = new Date().getFullYear() + i;
        return (
          <option key={year} value={year}>
            {year}
          </option>
        );
      })}
    </select>
    <Link
      to={"/allEvents"}
      className="bg-red-500 hover:bg-red-600 p-2 rounded text-white ml-0 md:ml-4"
    >
      All Events
    </Link>
    <button
      onClick={nextMonth}
      className="hover:bg-blue-500 p-2 font-bold text-md md:text-2xl rounded"
    >
      &gt;
    </button>
  </div>
);


  const renderDays = () => {
    const startDate = startOfWeek(currentMonth); 
    return (
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="font-semibold text-gray-600">
            {format(addDays(startDate, i), "E")} 
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth); 
    const monthEnd = endOfMonth(monthStart); 
    const startDate = startOfWeek(monthStart); 
    const endDate = startOfWeek(addDays(monthEnd, 6)); 

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day; 
        days.push(
          <div
            key={cloneDay}
            className={`border p-2 cursor-pointer w-fit transition duration-200 ease-in-out rounded-lg ${
              !isSameMonth(cloneDay, monthStart)
                ? "text-gray-400" 
                : "text-black"
            } ${
              isSameDay(cloneDay, selectedDate)
                ? "bg-blue-200" 
                : "hover:bg-blue-100" 
            }`}
            onClick={() => onDateClick(cloneDay)} 
          >
            <span className="block font-bold">{format(cloneDay, "d")}</span>
            {renderEvents(cloneDay)} 
          </div>
        );
        day = addDays(day, 1); 
      }

      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day}>
          {days}
        </div>
      );
    }

    return <div>{rows}</div>; 
  };

  const renderEvents = (date) => {
    const dayEvents = events.filter((event) =>
      isSameDay(new Date(event.date), date)
    );

    return dayEvents.map((event) => (
      <div
        key={event._id}
        className="bg-green-300 mt-1 p-1 text-xs cursor-pointer rounded transition duration-150 ease-in-out hover:bg-green-400"
        onClick={(e) => {
          e.stopPropagation();
          openModal(event);
        }}
      >
        <p className="font-bold text-red-800">{event.title}</p>
        <p className="font-semibold text-gray-800">{event.description}</p>
        <p className="text-gray-600">
          {new Date(event.date).toLocaleString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          })}
        </p>{" "}
      </div>
    ));
  };

  return (
    <div className="p-2 md:p-4 bg-gray-100 rounded-lg shadow-md">
      {renderHeader()} 
      {renderDays()} 
      {renderCells()} 
      {showModal && (
        <EventModal
          selectedDate={selectedDate} 
          event={selectedEvent} 
          closeModal={() => setShowModal(false)} 
          refreshEvents={fetchEvents} 
        />
      )}
    </div>
  );
};

export default Calendar;
