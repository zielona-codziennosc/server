import jwt from "jsonwebtoken";
import User from "../models/user";
import cache from "flat-cache";
import {OAuth2Client} from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const google = async (req, res) => {
    const { googleIdToken } = req.value.body;

    try {
        const { payload } = await googleClient.verifyIdToken({
            idToken: googleIdToken,
            audience: process.env.GOOGLE_AUDIENCE_CLIENT_ID
        });

        const seeekedUser = await User.accountOfPayload(payload);


        const expiresIn = 60 * 60;
        const token = jwt.sign({email: payload.email, id: seeekedUser._id}, process.env.JWT_SECRET, {expiresIn});

        res.status(200).json({success: true, id: seeekedUser._id, token, expiresIn});
    }
    catch(e) {
        res.status(400).json({success: false, message: "Something went wrong"});
    }

};

const login = async (req, res) => {
    const {email, password} = req.value.body;

    const targetUser = await User.findOne({email});
    const passwordValid = await targetUser?.checkPassword(password);

    if(passwordValid) {
        const expiresIn = 60 * 60;
        const token = jwt.sign({email: targetUser.email, id: targetUser._id}, process.env.JWT_SECRET, {expiresIn});

        res.status(200).json({success: true, id: targetUser._id, token, expiresIn})
    }
    else
        res.status(401).json({success: false});
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

const register = async (req, res) => {
  const newUser = new User(req.value.body);

  await newUser.save();

  res.status(201).json({success: true, id: newUser._id});
};


export default {google, login, logout, register};
