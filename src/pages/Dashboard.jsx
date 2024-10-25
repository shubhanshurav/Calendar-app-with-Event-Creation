import React from "react";
import Calendar from "../components/Calendar";
import { Link } from "react-router-dom";
// import EventList from "../components/EventList";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Your Calendar</h1>
      <Calendar />
      {/* <EventList /> */}
    </div>
  );
};

export default Dashboard;
