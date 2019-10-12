import { Schema, model } from 'mongoose';

import { ensureFieldUniquity, accountOfEmail } from "./utils";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true},
    gusUnitId: { type: String, default: "000000000000" } //the default is whole Poland
});


UserSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("email"));

UserSchema.static("accountOfEmail", accountOfEmail);

export default model('user', UserSchema);
