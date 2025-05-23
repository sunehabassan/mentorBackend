const Joi = require("joi");

const courseValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  mentorName: Joi.string().required(),
  category: Joi.string().required(),
  duration: Joi.string().required()
});

module.exports = {
  courseValidation,
};
