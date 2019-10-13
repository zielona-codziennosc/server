import multer from 'multer';
import Photo from "../models/photo";

const acceptedExtensions = ["png", "jpg", "jpeg"];

const fileFilter = (req, file, cb) => {
    const extension = extensionOf(file.originalname);
    const isActualPhoto = file.mimetype.split("/")[0] === "image";

    if(isActualPhoto && acceptedExtensions.includes(extension))
        return cb();
    else
        return cb("Extension not accepted");
};

const filename = async (req, file, cb) => {
    const extension = extensionOf(file.originalname);

    const photoId = await Photo.addOne(req.value.params.userId);

    cb(null, photoId+"."+extension)
};


const extensionOf = file => file.match(/\.[0-9a-z]+$/)[0].substring(1);

const photosStorage = multer.diskStorage({destination: "public/areaPhotos", filename, fileFilter});


const upload = multer({storage: photosStorage});




export default upload.single("photo");
