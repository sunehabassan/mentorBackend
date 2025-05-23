const router = require("express").Router();
const upload = require("../../middleware/multer.js");
const mentorAuth = require("../../middleware/mentorAuth.js");
const authenticateToken = require("../../middleware/mentorAuth.js");

// Unified Message Controller (Contact, FAQ, Testimonial)
const {
  submitMessage,
  getAnsweredFaqs,
  updateFaqAnswer,
  getFaqById,getAllFaqs
} = require("../../controllers/auth/messageController.js");

// Other Controllers
const register = require("../../controllers/auth/register");
const login = require("../../controllers/auth/login.js");
const { googleAuth } = require("../../controllers/auth/googleAuth.js");
const Mentorlogin = require("../../controllers/Login/Mentorlog.js");
const Studentlogin = require("../../controllers/Login/Studentlog.js");
const AddCourse = require("../../controllers/auth/Courses.js");
const getCourses = require("../../controllers/fetching/fetchCourse.js");
const deleteCourse = require("../../controllers/Delete/Courses.js");
const register2 = require("../../controllers/auth/register2.js");
const { getMyStudents } = require("../../controllers/auth/getMyStudents.js");
const { 
  createMentorProfile, 
  checkEmail, 
  getMentorInformation, 
  checkMentorProfileExists 
} = require("../../controllers/auth/teacherprofile");
const { getMentorData } = require("../../controllers/auth/GetMentor.js");
const { 
  createOrUpdateStudentProfile, 
  getStudentProfile 
} = require("../../controllers/Student/StudentProfile.js");
const requestController = require("../../controllers/auth/Request");
const {verifyStudentToken} = require("../../middleware/verifyStudentToken.js");
const { addTestimonial, getTestimonials } = require("../../controllers/auth/testimonial.js");
const { sendSessionDetails } = require("../../controllers/auth/sessionController");


router.post("/send-session-details",authenticateToken, sendSessionDetails);
// POST: Submit a new testimonial
router.post("/testimonial", addTestimonial);

// GET: Fetch all testimonials
router.get("/testimonial", getTestimonials);

// 📩 Unified Contact / FAQ / Testimonial Routes
router.post("/contact", submitMessage);                 // Submits contact form
router.get("/faqs", getAnsweredFaqs);                  // Gets only answered FAQs            
router.get("/faqs/all", getAllFaqs);                   // ✅ Gets all FAQs (admin)         
router.route("/faqs/:id")
  .get(getFaqById)
  .put(updateFaqAnswer); // Admin updates answer

// 🔐 Auth & Login Routes
router.post("/register", register);
router.post("/register2", register2);
router.post("/login", login);
router.post("/Mentorlog", Mentorlogin);
router.post("/Studentlog", Studentlogin);
router.post("/google", googleAuth);

// 🧑 Mentor Profile
router.post("/mentor", upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 }
]), createMentorProfile);
router.get("/mentor/:email", getMentorInformation);
router.get("/mentor/profile-exists/:email", checkMentorProfileExists);
router.post("/check-email", checkEmail);
router.get("/mentors", getMentorData);

// 📚 Courses
router.post("/Course", AddCourse);
router.get("/fetchCourse", getCourses);
router.delete("/deleteCourse/:id", deleteCourse);

// 👥 My Students (Mentor Protected)
router.get("/mystudents", mentorAuth, getMyStudents);

// 📄 Student Profile
router.post("/student-profile", authenticateToken, createOrUpdateStudentProfile);
router.get("/student-profile", authenticateToken, getStudentProfile);

// 🔄 Requests
// Apply to protected student routes
router.post("/send-request", verifyStudentToken, requestController.sendRequest);
router.get("/requests", authenticateToken, requestController.getRequests);
router.put("/update-request", authenticateToken, requestController.updateRequestStatus);

// ✅ Export Router
module.exports = router;
