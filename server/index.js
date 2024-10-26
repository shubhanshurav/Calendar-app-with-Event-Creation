const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const database = require("./config/database");
const allRoutes = require("./routes");

const PORT = process.env.PORT || 8000;

database.connect();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
  })
);

app.use("/api/v1", allRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Congrats, your server is successfully running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running on Port no: ${PORT}`);
});
