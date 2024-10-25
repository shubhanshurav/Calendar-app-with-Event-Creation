import axios from "axios"; // Axios ko import kar rahe hain for making HTTP requests
import { useEffect, useState } from "react"; // React hooks ko import kar rahe hain

const useFetchEvents = (currentMonth) => {
  const [events, setEvents] = useState([]); // Events ki state initialize kar rahe hain

  // Events ko fetch karne ke liye async function
  const fetchEvents = async () => {
    try {
      // Axios ka use karke backend se events ko fetch kar rahe hain
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/allEvents`, // Backend URL se events ki request
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token ko headers mein daal rahe hain
          },
        }
      );
      setEvents(res.data.events); // Response se events ko set kar rahe hain
    } catch (error) {
      // Agar koi error aaye to console mein error dikhayenge
      console.error("Error fetching events:", error);
    }
  };

  // useEffect hook ka use karke currentMonth change hone par events fetch kar rahe hain
  useEffect(() => {
    fetchEvents(); // Fetch function ko call kar rahe hain
  }, [currentMonth]); // Dependency array mein currentMonth ko daal rahe hain

  // Events, setEvents, aur fetchEvents ko return kar rahe hain
  return { events, fetchEvents };
};

export default useFetchEvents; // useFetchEvents hook ko export kar rahe hain
