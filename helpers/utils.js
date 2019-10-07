import jwt from "jsonwebtoken";
import cache from "flat-cache";

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
