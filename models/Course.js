const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mentorName: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);
