const mongoose = require("mongoose");

// Ensure models are registered
require("./Studentsnav/studentProfileSchema");
require("./mentorProfileSchema");

const RequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile", // ✅ Correct model name
      required: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorInformation",
      required: true,
    },
    email: {
      type: String, // Mentor's email
      required: true,
    },
    message: {
      type: String,
      default: "No message provided",
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    learningMode: {
  type: String,
  required: true,
}

  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
