import cache from "flat-cache";
import jwt from "jsonwebtoken";

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

export const authorize = (req, res, next) => {
    const {value: {params: {userId}}} = req;
    const {id} = req.user;

    if(userId !== id)
        return res.status(401).json({success: false, message: "Not authorized."});
    else
        next();
};
