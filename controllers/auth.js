import jwt from "jsonwebtoken";
import User from "../models/user";
import {OAuth2Client} from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const login = async (req, res) => {
    const { googleIdToken } = req.value.body;

    try {
        const { payload: { email } } = await googleClient.verifyIdToken({
            idToken: googleIdToken,
            audience: process.env.GOOGLE_AUDIENCE_CLIENT_ID
        });

        const seeekedUser = await User.accountOfEmail(email);

        const expiresIn = 60 * 60;
        const token = jwt.sign({email, id: seeekedUser._id}, process.env.JWT_SECRET, {expiresIn});

        res.status(200).json({success: true, token, expiresIn});
    }
    catch(e) {
        res.status(400).json({success: false, message: "Something went wrong"});
    }

};


export default {login};
