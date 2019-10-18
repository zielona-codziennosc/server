import { detectFaces } from "../helpers/imageValidation";

const scanImageForFaces = async (req, res, next) => {
    const faces = await detectFaces(req.file.path);

    if(faces.length > 0)
        return res.status(401).json({success: false, error: "Photo contains prohibited content: faces"});


    next();
};

export default [scanImageForFaces];
