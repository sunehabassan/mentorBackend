// controllers/mentorController.js
const Mentor = require('../../models/TokenModel');

const getMyStudents = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentor = await Mentor.findById(mentorId).populate('students');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.status(200).json({ students: mentor.students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
};

module.exports = {
  getMyStudents,
};
