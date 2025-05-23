// validators/faqValidation.js
const Joi = require("joi");

const faqValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(10).max(500).required(),
  });

  return schema.validate(data);
};

module.exports = faqValidation;
