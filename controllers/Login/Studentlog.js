const Login = require("../../models/register");
const { loginvalidation } = require("../../services/Studentlogin");
const jwt = require("jsonwebtoken");
const TokenLogin = require("../../models/TokenModel");

const login = async (req, res, next) => {
  try {
    // Step 1: Validation
    const loginValues = await loginvalidation.validateAsync(req.body);
    const { username, password } = loginValues;

    // Step 2: Verify
    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 3: Password Matching
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Step 4: Token Generation (Now includes `_id` as `studentId`)
    const token = jwt.sign(
      {
        studentId: user._id,   // Include studentId
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TIMEOUT }
    );

    const newToken = new TokenLogin({
      username: user.username,
      token,
    });
    await newToken.save();

    // Step 5: Response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        studentId: user._id,
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;
