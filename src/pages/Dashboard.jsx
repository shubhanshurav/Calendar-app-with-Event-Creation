import React from "react";
import Calendar from "../components/Calendar";
// import EventList from "../components/EventList";

const Dashboard = () => {
  return (
    <div className="px-4 md:px-20 py-6 bg-black h-screen">
      <h1 className="text-3xl font-bold mb-4 text-white text-center">Your Calendar</h1>
      <Calendar />
      {/* <EventList /> */}
    </div>
  );
};

export default Dashboard;
