import jwt from "jsonwebtoken";


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
