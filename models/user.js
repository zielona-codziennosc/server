import { Schema, model } from 'mongoose';

import { ensureFieldUniquity,
    hashPasswordOnCreate, hashPasswordAfterUpdate, checkPassword
    } from "./utils";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true},
    nickname: { type: String, required: true, unique: true},
    password: { type: String },
    profile_photo: { type: String, required: false }
}, {strict: false, minimize: false});


UserSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("email"));
UserSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("nickname"));
UserSchema.pre('save', hashPasswordOnCreate);
UserSchema.pre('findOneAndUpdate', hashPasswordAfterUpdate);


UserSchema.methods = {
    checkPassword
};

export default model('User', UserSchema)
