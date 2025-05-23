const express = require("express");
const backend = express.Router();
const authRoutes = require("./auth.route");


// navigate to auth.route.js file
backend.use("/auth", authRoutes);


module.exports = backend;