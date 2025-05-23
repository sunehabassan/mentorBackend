const MentorProfile = require("../../models/mentorProfileSchema");
const {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  stepFiveSchema,
  stepSixSchema
} = require("../../services/mentorProfileSchema");
const path = require("path");

// Create Mentor Profile
const createMentorProfile = async (req, res) => {
  try {
    let data = req.body;

    console.log("Incoming Data:", JSON.stringify(data, null, 2));

    // Parse JSON strings if needed
    data.availableDate = typeof data.availableDate === "string" ? JSON.parse(data.availableDate) : data.availableDate;
    data.preferredTime = typeof data.preferredTime === "string" ? JSON.parse(data.preferredTime) : data.preferredTime;
    data.teachingMode = typeof data.teachingMode === "string" ? JSON.parse(data.teachingMode) : data.teachingMode;

    // Validate data using stepTwoSchema
    await stepTwoSchema.validateAsync({
      availableDate: data.availableDate,
      preferredTime: data.preferredTime,
      timezone: data.timezone,
      teachingMode: data.teachingMode
    });

    // Check if mentor already exists
    const existingMentor = await MentorProfile.findOne({ email: data.email });
    if (existingMentor) {
      return res.status(409).json({ success: false, message: "Email already exists." });
    }

    // Handle file uploads
    const profilePhoto = req.files?.profilePhoto?.[0];
    const resume = req.files?.resume?.[0];

    const profilePhotoUrl = profilePhoto ? `/Mentorship/${path.basename(profilePhoto.path)}` : null;
    const resumeUrl = resume ? `/Mentorship/${path.basename(resume.path)}` : null;

    // Create mentor profile
    const mentorData = {
      ...data,
      profilePhotoUrl,
      resumeUrl,
    };

    const newMentor = new MentorProfile(mentorData);
    await newMentor.save();

    res.status(201).json({
      success: true,
      message: "Mentor profile created successfully.",
      mentor: newMentor
    });

  } catch (err) {
    console.error("Error in createMentorProfile:", err);
    res.status(400).json({
      success: false,
      message: err.details ? err.details[0].message : err.message
    });
  }
};

// Check if Email Exists
const checkEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  const exists = await MentorProfile.findOne({ email });
  if (exists) {
    return res.status(409).json({ success: false, message: "Email already exists." });
  }

  return res.status(200).json({ success: true, message: "Email is available." });
};

// Get Mentor Information by Email
const getMentorInformation = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const mentor = await MentorProfile.findOne({ email });

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor profile not found." });
    }

    res.status(200).json({ success: true, data: mentor });

  } catch (err) {
    console.error("Error in getMentorInformation:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Check if Mentor Profile Exists by Email
const checkMentorProfileExists = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }

  try {
    const mentor = await MentorProfile.findOne({ email });

    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor profile not found." });
    }

    return res.status(200).json({ success: true, profileExists: true, data: mentor });

  } catch (err) {
    console.error("Error in checkMentorProfileExists:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createMentorProfile,
  checkEmail,
  getMentorInformation,
  checkMentorProfileExists
};
