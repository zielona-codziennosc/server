import { Schema, model } from 'mongoose';

import { ensureFieldUniquity, accountOfEmail } from "./utils";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true}
}, {strict: false, minimize: false});


UserSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("email"));

UserSchema.static("accountOfEmail", accountOfEmail);

export default model('User', UserSchema)
