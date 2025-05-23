// Importing Joi for input validation
const Joi = require("joi");

// Defining a validation schema for user registration
const registrationValidation = Joi.object({
    username:Joi.string().required(), // Ensures username is a required string
    password: Joi.string().required(), // Ensures username is a required string
    email: Joi.string().required().email(),   // Ensures email is a required string and a valid email format
});

// Exporting the validation schema so it can be used in other parts of the application
module.exports = { registrationValidation };