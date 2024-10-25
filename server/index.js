const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const allRoutes = require("./routes");

const PORT = process.env.PORT || 8000;

// Connect to the database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS middleware (must be above routes to ensure headers are applied)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials like cookies
  })
);

// Routes
app.use("/api/v1", allRoutes);

// Root route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Congrats, your server is successfully running....",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running on Port no: ${PORT}`);
});
