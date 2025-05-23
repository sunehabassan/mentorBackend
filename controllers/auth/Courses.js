const Course = require("../../models/Course");
const { courseValidation } = require("../../services/Coursevalid");

const AddCourse = async (req, res, next) => {
  try {
    // Step 1: Validate the course data
    const validatedData = await courseValidation.validateAsync(req.body);
    const { title, description, mentorName, category, duration } = validatedData;

    // Step 2: Optional - Check if a course with the same title exists
    const existingCourse = await Course.findOne({ title });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course title already exists",
        data: { title }
      });
    }

    // Step 3: Create and save the course
    const newCourse = new Course({
      title,
      description,
      mentorName,
      category,
      duration,
    });

    await newCourse.save();

    // Step 4: Respond to client
    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: newCourse,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = AddCourse;
