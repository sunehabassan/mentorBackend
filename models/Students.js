const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  enrolledDate: {
    type: Date,
    default: Date.now
  },
  // other fields...
});

module.exports = mongoose.model('Student', studentSchema);
