import jwt from "jsonwebtoken";
import cache from "flat-cache"
import glob from "glob";
import fs from "fs";
import User from "../models/user";

export const authenticate = (req, res, next) => {
    try {
        const { token } = req.value;

        const flatfile = cache.load("jwt_blacklist");

        if(flatfile.getKey(token))
            throw "Token has been blacklisted";

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

export const cleanBlacklistCache = () => {
    const flatfile = cache.load("jwt_blacklist");
    const blacklistedTokens = flatfile.all();

    const currentTimeStamp = Math.floor(Date.now() / 1000);

    Object.entries(blacklistedTokens).forEach(([token, expirationTimeStamp]) => {
        if(expirationTimeStamp < currentTimeStamp)
            flatfile.removeKey(token);
    });

    flatfile.save();
};

export const removePhotoOfId = photoId => {
    glob(`public/areaPhotos/${photoId}.*`, (err, files) => {
        if(err)
            return;

        fs.unlink(files[0], err => {
            if(err)
                console.log(err);
        })
    })
};
