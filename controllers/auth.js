import jwt from "jsonwebtoken";
import cache from "flat-cache"
import User from "../models/user";

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
    const { token } = req.value;

    try {
        const { exp } = jwt.verify(token, process.env.JWT_SECRET);

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

    res.status(202).json({success: true});
};


export default {login, logout, register}
