// Importing necessary packages
const express = require("express"); // Framework to create server and handle routes
require("./models/register");
require("./models/mentorProfileSchema");
require("./models/Request");
require('dotenv').config(); // Load environment variables from a .env file
const path = require('path')
const mongoose = require("mongoose"); // ODM for MongoDB
const chalk = require("chalk"); // For colorful console messages
const routes = require("./routes"); // Importing custom defined routes
const cors = require("cors"); // Middleware to handle Cross-Origin Resource Sharing

// Initialize the Express app
const backend = express();
backend.use('/Mentorship', express.static(path.join(__dirname, 'Mentorship')));

// Middleware to parse JSON request bodies
backend.use(express.json());
backend.use(express.urlencoded({ extended: true }));
// Enable CORS for all origins and common HTTP methods
backend.use(cors({
  origin: "*",  // Allow requests from any domain (not recommended for production)
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
}));

// Use imported routes for handling API requests
backend.use(routes); 

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.DBURL)
  .then(() => {
    // Log successful connection to MongoDB
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`);

    // Start the server on the defined PORT or default to 3000
    const PORT = process.env.PORT || 3000;
    backend.listen(PORT, () => {
      console.log(`${chalk.green("✓")} ${chalk.blue("Server Started on port")} ${chalk.bgMagenta.white(PORT)}`);
    });
  })
  .catch((err) => {
    // Log any errors during MongoDB connection
    console.log(err);
  });