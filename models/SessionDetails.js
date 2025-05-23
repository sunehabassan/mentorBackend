const mongoose = require("mongoose");

const sessionDetailsSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    required: true,
    unique: true
  },
  mentorEmail: { type: String},
  learningMode: { type: String, enum: ["Email", "Voice Call", "Video Call"], required: true },
  sessionLink: { type: String, required: true }, // Can be email or Google Meet link
  createdAt: { type: Date, default: Date.now },
  emailStatus: {
  type: String,
  enum: ['sent', 'failed'],
  default: 'sent'
}

});

module.exports = mongoose.model("SessionDetails", sessionDetailsSchema);
