import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import './index.css';
import EventList from "./components/EventList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route path="/allEvents" element={
          <PrivateRoute><EventList /></PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
