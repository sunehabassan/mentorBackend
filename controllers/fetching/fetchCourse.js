const Course = require('../../models/Course');

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching courses",
    });
  }
};

module.exports = getCourses;