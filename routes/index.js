// routes/index.js
// Import the Express Router to create a modular routing system
const backend = require('express').Router();
// Import API routes from the "api" folder (ensure the correct path)
const apiRoutes = require("./api/index.js");

//navigate to api/index.js file
// 🔹 Route all "/api" requests to the API routes
backend.use("/api", apiRoutes);
// Example: If a request comes to "/api/users", it will be handled inside "api/index.js"


// 🔹 Handle unmatched routes (404 error)
backend.use("/api", (req, res, next) => {
   // Create an error object with a "Route not found" message
  const error = new Error("Route not found.");
  error.status = 404;
  next(error);  // Pass the error to the next middleware (error handler)
});

// 🔹 Global error handler middleware
backend.use((error, req, res, next) => {
   // Respond with the error details in JSON format
  res.status(error.status || 500).json({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

module.exports = backend;