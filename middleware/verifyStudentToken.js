const jwt = require("jsonwebtoken");
const StudentProfile = require("../models/Studentsnav/studentProfileSchema");

exports.verifyStudentToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await StudentProfile.findOne({ username: decoded.username });

    if (!student) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    req.user = {
      studentId: student._id,
      username: student.username,
    };

    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
