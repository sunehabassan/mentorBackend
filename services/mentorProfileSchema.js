const Joi = require('joi');

// Step 1: Personal Information
const stepOneSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional()
});

// Step 2: Availability
const stepTwoSchema = Joi.object({
  availableDate: Joi.array().items(Joi.date().iso()).length(2).required(),
  preferredTime: Joi.array().items(Joi.date().iso()).length(2).required(),
  timezone: Joi.string().required(),
  teachingMode: Joi.array().items(Joi.string()).required()
}).unknown(true);


// Step 3: Background
const stepThreeSchema = Joi.object({
  jobTitle: Joi.string().required(),
  company: Joi.string().required(),
  education: Joi.string().required(),
  certifications: Joi.string().optional()
});

// Step 4: Experience
const stepFourSchema = Joi.object({
  experience: Joi.number().required(),
  mentoredBefore: Joi.string().valid("yes", "no").required(),
  experienceDetails: Joi.string().optional(),
  motivation: Joi.string().required()
});

// Step 5: Document Upload
const stepFiveSchema = Joi.object({
  resumeUrl: Joi.string().uri().optional(), // optional since actual file is uploaded
  profilePhotoUrl: Joi.string().uri().optional()
});

// Step 6: Social Media
const stepSixSchema = Joi.object({
  linkedin: Joi.string().uri().optional(),
  github: Joi.string().uri().optional(),
  twitter: Joi.string().uri().optional()
});

module.exports = {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  stepFiveSchema,
  stepSixSchema
};
