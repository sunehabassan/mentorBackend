const Login = require("../../models/User.model");
const { loginvalidation } = require("../../services/loginvalidation");
const jwt = require('jsonwebtoken')
const TokenLogin = require('../../models/TokenModel')

const login = async (req, res, next) => {
  try {


    // Step 1: Validation
    const loginValues = await loginvalidation.validateAsync(req.body);
    const { username, password } = loginValues;

    // console.log(username)

    // Step 2: Verify 
    const user = await Login.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Step 3:password matching

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

//Step: token genration


const token= jwt.sign(
  {username, password}, process.env.JWT_SECRET , {expiresIn: process.env.JWT_TIMEOUT,}
);

//token saved
const newToken= new TokenLogin({username, password, token})
await newToken.save()

// console.log(newToken)



    // Step 4: response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: { username: user.username,
        token: token,
       },
    });
  } catch (error) {
    next(error); 
  }
};

module.exports = login;