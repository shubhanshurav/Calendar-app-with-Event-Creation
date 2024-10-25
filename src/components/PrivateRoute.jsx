import React from "react"; // React ko import kar rahe hain
import { Navigate } from "react-router-dom"; // Navigate component ko import kar rahe hain for redirection

// PrivateRoute component jo protected routes ko handle karta hai
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Local storage se token ko fetch kar rahe hain

  // Agar token hai to children render karo, nahi to login page pe redirect karo
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute; // PrivateRoute component ko export kar rahe hain
