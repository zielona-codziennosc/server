import jwt from "jsonwebtoken";
import glob from "glob";
import fs from "fs";
import User from "../models/user";

export const authenticate = (req, res, next) => {
    const { token } = req.value;

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    }
    catch {
        res.status(400).json({success: false, message: "Failed to authenticate"});
    }

};

export const dailyVariableCleanup = async () => {
    await User.updateMany({}, {$unset: {todaysSavings: ""}});
};

export const removePhotoOfId = photoId => {
    glob(`public/areaPhotos/${photoId}.*`, (err, files) => {
        if(err)
            return;

        fs.unlink(files[0], err => {
            console.log(err);
        })
    })
};
