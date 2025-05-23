const Login = require("../../models/User.model");
const { loginvalidation } = require("../../services/Mentorvalid");
const jwt = require("jsonwebtoken");
const TokenLogin = require("../../models/TokenModel");
const {IdModel}= require("../../models/mentorProfileSchema")
const MentorProfileSchema = require("../../models/mentorProfileSchema")


const login = async (req, res, next) => {
  try {
    // Step 1: Validation
    const loginValues = await loginvalidation.validateAsync(req.body);
    const { username, password } = loginValues;


    // Step 2: Verify User
    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const email = user.email
    console.log(email)


    // Step 3: Password Matching
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Step 4: Token Generation
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );

    const newToken = new TokenLogin({ username, password, token });
    await newToken.save();



    // Step 5: Response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { // Changed to mentorId for consistency
        username: user.username,
        email: user.email,
        token: token,
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = login;
