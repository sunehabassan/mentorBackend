const mongoose = require('mongoose');

const MentorProfileSchema = new mongoose.Schema({
  // Personal info
  fullName: String,
  email: String,
  phone: String,

  // Availability (updated to arrays)
  availableDate: {
    type: [Date],
    validate: v => Array.isArray(v) && v.length === 2
  },
  preferredTime: {
    type: [Date],
    validate: v => Array.isArray(v) && v.length === 2
  },
  timezone: String,
  teachingMode: [String],

  // Background
  jobTitle: String,
  company: String,
  education: String,
  certifications: String,

  // Experience
  experience: Number,
  mentoredBefore: String,
  experienceDetails: String,
  motivation: String,

  // Document upload
  resumeUrl: String,
  profilePhotoUrl: String,

  // Social media
  linkedin: String,
  github: String,
  twitter: String,
}, { timestamps: true });

module.exports = mongoose.model('MentorInformation', MentorProfileSchema);
