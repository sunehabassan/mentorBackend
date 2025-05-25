// Importing necessary packages
const express = require("express");
require("dotenv").config(); // Load env variables
require("./models/register");
require("./models/mentorProfileSchema");
require("./models/Request");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const routes = require("./routes");
const cors = require("cors");

// Initialize the Express app
const backend = express();
backend.use('/Mentorship', express.static(path.join(__dirname, 'Mentorship')));

// Middleware to parse JSON request bodies
backend.use(express.json());
backend.use(express.urlencoded({ extended: true }));

// Enable CORS dynamically for .vercel.app and localhost
backend.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow tools like Postman
    if (
      origin.endsWith(".vercel.app") ||
      origin === "http://localhost:3000"
    ) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin); // Optional: log blocked origins
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

// Use imported routes
backend.use(routes);

// Connect to MongoDB using 
mongoose.connect(process.env.DBURL)
  .then(() => {
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`);
    const PORT = process.env.PORT || 3000;
    backend.listen(PORT, () => {
      console.log(`${chalk.green("✓")} ${chalk.blue("Server Started on port")} ${chalk.bgMagenta.white(PORT)}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
