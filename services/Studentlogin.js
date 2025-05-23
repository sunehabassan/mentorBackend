const Joi = require("joi");

const loginvalidation= Joi.object({
    username:Joi.string().required(),// Ensures username is a required string
    password: Joi.string().required(),
   
});

// Exporting the validation schema so it can be used in other parts of the application
module.exports = { loginvalidation };