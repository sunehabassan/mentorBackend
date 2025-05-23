const StudentProfile = require("../../models/Studentsnav/studentProfileSchema");

// Create or Update Student Profile
const createOrUpdateStudentProfile = async (req, res) => {
  try {
    const { 
      desiredCourses, 
      courseCount, 
      learningMode, 
      learningGoal, 
      qualification, 
      learningPreferences 
    } = req.body;
    
    const { username, email } = req.user;

    const existingProfile = await StudentProfile.findOne({ email });

    if (existingProfile) {
      existingProfile.username = username;
      existingProfile.desiredCourses = desiredCourses;
      existingProfile.courseCount = courseCount;
      existingProfile.learningMode = learningMode;
      existingProfile.learningGoal = learningGoal;
      existingProfile.qualification = qualification;
      existingProfile.learningPreferences = learningPreferences;
      
      await existingProfile.save();

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        data: existingProfile,
      });
    }

    const newProfile = new StudentProfile({
      username,
      email,
      desiredCourses,
      courseCount,
      learningMode,
      learningGoal,
      qualification,
      learningPreferences,
    });

    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      data: newProfile,
    });

  } catch (err) {
    console.error("Error in createOrUpdateStudentProfile:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const { email } = req.user;
    const profile = await StudentProfile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found." });
    }

    res.status(200).json({ success: true, data: profile });

  } catch (err) {
    console.error("Error in getStudentProfile:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { createOrUpdateStudentProfile, getStudentProfile };
