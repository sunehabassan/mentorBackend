const SessionDetails = require("../../models/SessionDetails");
const Request = require("../../models/Request");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const sendSessionDetails = async (req, res) => {
  try {
    const { requestId, sessionLink } = req.body;
    const mentorEmail = req.user.email;

    // Find the request
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Prevent duplicates
    const existing = await SessionDetails.findOne({ requestId });
    if (existing) return res.status(400).json({ message: "Session already exists" });

    // Setup mail transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare message based on learning mode
    let linkMessage = {
      "Email": `You can contact your mentor via email: <strong>${sessionLink}</strong>`,
      "Voice Call": `Join the voice call: <a href="${sessionLink}">${sessionLink}</a>`,
      "Video Call": `Join the video session: <a href="${sessionLink}">${sessionLink}</a>`,
    };

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hi ${request.studentName},</h2>
        <p>Your mentorship request has been <strong>accepted</strong>! 🎉</p>
        <p>${linkMessage[request.learningMode]}</p>
        <p>Best wishes,<br><strong>Mentorverse Team</strong></p>
      </div>
    `;

    // Optional: attach session agenda file (ensure this file exists)
    const attachmentPath = path.join(__dirname, "../../public/session-agenda.pdf");
    const attachments = fs.existsSync(attachmentPath)
      ? [{ filename: "session-agenda.pdf", path: attachmentPath }]
      : [];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: request.studentEmail,
      subject: "🎓 Your Mentorship Session is Ready!",
      html: htmlContent,
      attachments,
    };

    // Send mail
    let emailStatus = "sent";
    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error("Email failed:", err);
      emailStatus = "failed";
    }

    // Create session
    await SessionDetails.create({
      requestId,
      mentorEmail,
      learningMode: request.learningMode,
      sessionLink,
      emailStatus,
    });

    res.status(200).json({ message: `Session created and email ${emailStatus}.` });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendSessionDetails };
