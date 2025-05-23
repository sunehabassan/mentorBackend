const axios = require('axios');
const jwt = require('jsonwebtoken');
const { oauth2Client } = require('../../utils/googleClient');
const User = require('../../models/userModel');

exports.googleAuth = async (req, res, next) => {

    try {
        
        //step1: code le ke ana
        const code = req.query.code;
        // console.log(code);


        //step2: validation/ authenticate krna using google

        const googleRes = await oauth2Client.getToken(code);
        // console.log(googleRes)



        //step3: save token form the google response

        oauth2Client.setCredentials(googleRes.tokens);



        //step4: get information from google using token

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );


        //step5: save user data into variables

        const { email, name, picture } = userRes.data;
        // console.log(userRes);




        //step6: check if user exists already

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
            });
        }


        //step7: to authenticate the user from our server, our server will require the jwt token
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });
        //step8: response
        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};