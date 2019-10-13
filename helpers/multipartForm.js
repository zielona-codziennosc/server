import multer from 'multer';

const upload = multer({dest: "public/areaPhotos"});


export default upload.single("photo");
