const MentorInformation = require('../../models/mentorProfileSchema');
const Course = require('../../models/Course');

// Controller to fetch mentor and course data
const getMentorData = async (req, res) => {
  try {
    // Fetch mentor profile data
    const mentors = await MentorInformation.find({});

    // Fetch course data for each mentor (you can adjust this if needed)
    const courses = await Course.find({});
    
    // Combine both mentor and course data
    const mentorCards = mentors.map(mentor => {
      const mentorCourses = courses.filter(course => course.mentorName === mentor.fullName);

      return {
        ...mentor.toObject(),
        courses: mentorCourses
      };
    });

    // Return the combined data to the frontend
    res.status(200).json(mentorCards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mentor data', error });
  }
};

module.exports = { getMentorData };
