const Request = require("../../models/Request");
const MentorInformation = require("../../models/mentorProfileSchema");
const StudentProfile = require("../../models/Studentsnav/studentProfileSchema");
const nodemailer = require("nodemailer");

// ✅ Setup Nodemailer transporter (configure your credentials securely via environment variables)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your gmail address
    pass: process.env.EMAIL_PASSWORD,   // your gmail app password (not your login password)
  },
});

/**
 * Send Request to a Mentor
 */
exports.sendRequest = async (req, res) => {
  try {
    const { email, message } = req.body;
    const studentId = req.user?.studentId;

    if (!studentId) {
      return res.status(401).json({ error: "Unauthorized. Student ID not found." });
    }

    if (!email) {
      return res.status(400).json({ error: "Mentor Email is required." });
    }

    const mentor = await MentorInformation.findOne({ email });
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found." });
    }

    const student = await StudentProfile.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    const existingRequest = await Request.findOne({
      studentId,
      mentorId: mentor._id,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ error: "You have already sent a request to this mentor." });
    }

    const newRequest = new Request({
      studentId,
      mentorId: mentor._id,
      email: mentor.email,
      message: message || "No message provided",
      status: "pending",
      studentEmail: student.email,
      studentName: student.username,
      learningMode: student.learningMode,
    });

    await newRequest.save();

    res.status(200).json({ message: "Request sent successfully." });

  } catch (error) {
    console.error("Error sending request:", error);
    res.status(500).json({ error: "Error sending request. Please try again later." });
  }
};

/**
 * Get Requests for a Mentor using Email
 */
exports.getRequests = async (req, res) => {
  const { mentorEmail } = req.query;
  const email = mentorEmail;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const requests = await Request.find({ email });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update Request Status and Send Email Notification
 */
exports.updateRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;

  if (!requestId || !status) {
    return res.status(400).json({ success: false, message: "Request ID and status are required" });
  }

  try {
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = status;
    await request.save();

    // ✅ Send Email Notification to Student
    const subject = `Your mentorship request was ${status}`;
    const html = `
      <h3>Hello ${request.studentName},</h3>
      <p>Your request to mentor <strong>${request.email}</strong> has been <strong>${status}</strong>.</p>
      <p>Learning Mode: <strong>${request.learningMode}</strong></p>
      <p>Thank you for using Mentorverse!</p>
    `;

    let emailSent = false;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: request.studentEmail,
        subject,
        html,
      });
      emailSent = true;
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
    }

    res.status(200).json({
      success: true,
      message: `Request ${status} successfully.`,
      emailSent,
    });

  } catch (error) {
    console.error("Error updating request status:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
