import { Schema, model } from 'mongoose';

import { addOne } from "./utils/photo";

const PhotoSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, required: true}
});

PhotoSchema.static("addOne", addOne);


export default model('photo', PhotoSchema);
