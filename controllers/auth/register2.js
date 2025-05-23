// routes/controllers/auth/register.js
const Register = require("../../models/register");
const { registrationValidation } = require("../../services/register");
const nodemailer= require("nodemailer");
const register = async (req, res, next) => {
  try {
    // Step 1: Validate the incoming data
    const registerValues = await registrationValidation.validateAsync(req.body);
    const { username, email, password } = registerValues;

    // Step 2: Check if the username already exists
    const userExists = await Register.findOne({ username });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
        data: {username}
      });
    }

    // Step 3: Create a new user
    const newUser = new Register({ username, email, password });
    await newUser.save();

  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
  from: `"MentorVerse Registration" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: '🎉 Welcome to MentorVerse!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
      <div style="text-align: center; padding-bottom: 20px;">
        <h2 style="color: #4CAF50;">Welcome to Mentorverse, ${username}!</h2>
      </div>
      
      <p style="font-size: 16px; color: #333;">
        We're thrilled to have you join our community of passionate MentorVerse professionals. Your account has been successfully registered!
      </p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

     

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

      <p style="font-size: 16px; color: #333;">
        If you have any questions or need support, feel free to reach out to us anytime.
      </p>

      <p style="font-size: 16px; color: #333;">Warm wishes,<br/><strong>The MentorVerse Team</strong></p>

    </div>
  `
};


    await transporter.sendMail(mailOptions);

    // Step 4: Response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { username, email },
    });
  }
  
  catch (error) {
    next(error);
  }
};

module.exports = register;
