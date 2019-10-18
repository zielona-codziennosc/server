import jwt from "jsonwebtoken";
import User from "../models/user";
import cache from "flat-cache";
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

        res.status(200).json({success: true, id: seeekedUser._id, token, expiresIn});
    }
    catch(e) {
        res.status(400).json({success: false, message: "Something went wrong"});
    }

};

const logout = (req, res) => {

    const {token} = req.value;

    try {
        const { exp } = jwt.decode(token);

        const flatfile = cache.load("jwt_blacklist");

        flatfile.setKey(token, exp);
        flatfile.save();

        res.status(200).json({success: true});
    }
    catch {
        res.status(400).json({success: false});
    }
};


export default {login,logout};
