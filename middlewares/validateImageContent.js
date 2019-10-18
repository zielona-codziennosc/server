import { detectFaces } from "../helpers/imageValidation";
import {annihilatePhotoOfIds, removePhotoOfId} from "../helpers/utils";

const scanImageForFaces = async (req, res, next) => {
    const faces = await detectFaces(req.file.path);


    if(faces.length > 0) {
        const photoId = req.file.filename.split(".")[0];
        const {userId} = req.value.params;

        annihilatePhotoOfIds({photoId, userId});

        return res.status(401).json({success: false, error: "Photo contains prohibited content: faces"});
    }


    next();
};

export default [scanImageForFaces];
