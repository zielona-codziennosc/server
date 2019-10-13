import {Types} from "mongoose";

export const addOne = async function(userId) {

    const photoId = new Types.ObjectId();

    const newPhoto = new this({
        _id: photoId,
        userId
    });

    await newPhoto.save();

    return photoId;
};
