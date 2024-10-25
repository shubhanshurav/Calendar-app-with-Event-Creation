import React from "react";
import Calendar from "../components/Calendar";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Your Calendar</h1>
      <Calendar />
    </div>
  );
};

export default Dashboard;
