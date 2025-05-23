const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    answer: { type: String, default: "" },      // Optional: For admin FAQ response
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
