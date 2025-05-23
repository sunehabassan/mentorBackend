// controllers/course/deleteCourse.js
const Course = require('../../models/Course');

const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteCourse;
