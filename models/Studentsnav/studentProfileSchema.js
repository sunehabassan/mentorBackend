const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  desiredCourses: [{ type: String }],
  courseCount: { type: Number },
  learningMode: { type: String, enum: ["Email", "Voice Call", "Video Call"], default: "Email" },
  learningGoal: { type: String },
  qualification: { type: String },
  learningPreferences: [{ type: String }]
});

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

module.exports = StudentProfile;
