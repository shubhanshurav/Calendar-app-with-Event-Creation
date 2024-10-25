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
  // State variables declare kar rahe hain
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Aaj ka mahina
  const [selectedDate, setSelectedDate] = useState(new Date()); // Chuni hui tarikh
  const [showModal, setShowModal] = useState(false); // Modal dikhane ke liye
  const [selectedEvent, setSelectedEvent] = useState(null); // Chuna hua event

  // Events fetch karne ke liye custom hook
  const { events, fetchEvents } = useFetchEvents(currentMonth);

  // Tarikh par click hone par
  const onDateClick = useCallback(
    (day) => {
      setSelectedDate(day); // Selected date set karna
      const dayEvents = events.filter(
        (event) => isSameDay(new Date(event.date), day) // Us din ke events filter karna
      );

      if (dayEvents.length === 0) {
        setSelectedEvent(null); // Agar koi event nahi hai to selected event null karna
        setShowModal(true); // Modal show karna
      }
    },
    [events]
  );

  // Event modal kholne ke liye
  const openModal = useCallback((event) => {
    setSelectedEvent(event); // Selected event set karna
    setShowModal(true); // Modal kholna
  }, []);

  // Month aur year change karne ka function
  const changeMonthYear = (newMonth, newYear) => {
    const newDate = new Date(newYear, newMonth); // Nayi date create karna
    setCurrentMonth(newDate); // Current month update karna
  };

  // Pichla mahina dikhane ke liye
  const prevMonth = () => setCurrentMonth(addDays(currentMonth, -30));
  // Agla mahina dikhane ke liye
  const nextMonth = () => setCurrentMonth(addDays(currentMonth, 30));

  // Calendar header render karne ka function
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4 p-2 bg-blue-600 text-white rounded-lg">
      <button
        onClick={prevMonth}
        className="hover:bg-blue-500 font-bold text-2xl p-2 rounded"
      >
        &lt; {/* Pichla mahina */}
      </button>
      {/* Month selector dropdown */}
      <select
        className="bg-blue-600 border border-white text-white rounded px-2 py-1 mx-2"
        onChange={(e) =>
          changeMonthYear(parseInt(e.target.value), currentMonth.getFullYear())
        }
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <option key={i} value={i}>
            {format(new Date(2021, i), "MMMM")} {/* Mahine ka naam */}
          </option>
        ))}
      </select>
      {/* Year selector dropdown */}
      <select
        className="bg-blue-600 border border-white text-white rounded px-2 py-1 mx-2"
        onChange={(e) =>
          changeMonthYear(currentMonth.getMonth(), parseInt(e.target.value))
        }
      >
        {Array.from({ length: 10 }).map((_, i) => {
          const year = new Date().getFullYear() + i; // 5 saal ka range
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>
      <Link
        to={"/allEvents"}
        className="bg-red-500 hover:bg-red-600 p-2 rounded text-white ml-4"
      >
        Show All Events
      </Link>
      <button
        onClick={nextMonth}
        className="hover:bg-blue-500 p-2 font-bold text-2xl rounded"
      >
        &gt; {/* Agla mahina */}
      </button>
    </div>
  );

  // Din ke naam render karne ka function
  const renderDays = () => {
    const startDate = startOfWeek(currentMonth); // Hafte ki shuruaat
    return (
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="font-semibold text-gray-600">
            {format(addDays(startDate, i), "E")} {/* Din ka naam */}
          </div>
        ))}
      </div>
    );
  };

  // Calendar cells render karne ka function
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth); // Mahine ki shuruaat
    const monthEnd = endOfMonth(monthStart); // Mahine ka ant
    const startDate = startOfWeek(monthStart); // Hafte ki shuruaat
    const endDate = startOfWeek(addDays(monthEnd, 6)); // Agle hafte ki shuruaat

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];

      for (let i = 0; i < 7; i++) {
        const cloneDay = day; // Din ko clone karna
        days.push(
          <div
            key={cloneDay}
            className={`border p-2 cursor-pointer transition duration-200 ease-in-out rounded-lg ${
              !isSameMonth(cloneDay, monthStart)
                ? "text-gray-400" // Agar current month nahi hai
                : "text-black"
            } ${
              isSameDay(cloneDay, selectedDate)
                ? "bg-blue-200" // Agar selected date hai
                : "hover:bg-blue-100" // Hover par background change
            }`}
            onClick={() => onDateClick(cloneDay)} // Click hone par date click function
          >
            <span className="block font-bold">{format(cloneDay, "d")}</span>
            {renderEvents(cloneDay)} {/* Din ke events render karna */}
          </div>
        );
        day = addDays(day, 1); // Agle din par jana
      }

      rows.push(
        <div className="grid grid-cols-7 gap-1" key={day}>
          {days}
        </div>
      );
    }

    return <div>{rows}</div>; // Rows return karna
  };

  // Events render karne ka function
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
          {format(new Date(event.date), "hh:mm a")}
        </p>{" "}
      </div>
    ));
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      {renderHeader()} {/* Header render karna */}
      {renderDays()} {/* Din render karna */}
      {renderCells()} {/* Cells render karna */}
      {showModal && (
        <EventModal
          selectedDate={selectedDate} // Selected date modal ko bhejna
          event={selectedEvent} // Selected event modal ko bhejna
          closeModal={() => setShowModal(false)} // Modal close karne ka function
          refreshEvents={fetchEvents} // Events ko refresh karne ka function
        />
      )}
    </div>
  );
};

export default Calendar; // Calendar component export karna
