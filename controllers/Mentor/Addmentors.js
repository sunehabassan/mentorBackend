const MentorProfile = require("../../models/mentorProfileSchema");
const { mentorProfileSchema } = require("../../services/mentorProfileSchema");

// Add Mentor Profile
const addMentorProfile = async (req, res) => {
  try {
    // Step 1: Parse form fields
    const formData = req.body;

    // Step 2: Validate non-file fields
    const mentorData = await mentorProfileSchema.validateAsync(formData);

    // Step 3: Check if email already exists
    const existingMentor = await MentorProfile.findOne({ email: mentorData.email });
    if (existingMentor) {
      return res.status(409).json({
        success: false,
        message: "A mentor with this email already exists.",
      });
    }

    // Step 4: Handle file uploads
    const profilePhoto = req.files?.profilePhoto?.[0]?.filename || "";
    const resume = req.files?.resume?.[0]?.filename || "";

    // Step 5: Create and save new mentor
    const newMentor = new MentorProfile({
      fullName: mentorData.fullName,
      profilePhoto,
      resume,
      email: mentorData.email,
      phone: mentorData.phone,
      linkedin: mentorData.linkedin,
      portfolio: mentorData.portfolio,
      jobTitle: mentorData.jobTitle,
      company: mentorData.company,
      experience: mentorData.experience,
      education: mentorData.education,
      certifications: mentorData.certifications,
      primarySkills: mentorData.primarySkills,
      secondarySkills: mentorData.secondarySkills,
      industries: mentorData.industries,
      topics: mentorData.topics,
      mentoredBefore: mentorData.mentoredBefore,
      experienceDetails: mentorData.experienceDetails,
      motivation: mentorData.motivation,
      timezone: mentorData.timezone,
      availability: mentorData.availability,
      mode: mentorData.mode,
      maxMentees: mentorData.maxMentees,
      menteeType: mentorData.menteeType,
      expectations: mentorData.expectations,
      videoUrl: mentorData.videoUrl,
      socialLinks: mentorData.socialLinks,
      approvalStatus: mentorData.approvalStatus || "pending",
      applicationDate: mentorData.applicationDate,
      adminNotes: mentorData.adminNotes || "",
    });

    await newMentor.save();

    res.status(201).json({
      success: true,
      message: "Mentor profile created successfully.",
      data: newMentor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.details ? error.details[0].message : error.message,
    });
  }
};

// Get All Mentor Profiles
const getAllMentorProfiles = async (req, res) => {
  try {
    const mentors = await MentorProfile.find({}, { password: 0 });

    if (!mentors.length) {
      return res.status(404).json({
        success: false,
        message: "No mentor profiles found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mentor profiles retrieved successfully.",
      data: mentors,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addMentorProfile,
  getAllMentorProfiles,
};
