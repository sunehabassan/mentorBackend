const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: String,
  email: String,
  // other fields...
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Mentor', mentorSchema);
