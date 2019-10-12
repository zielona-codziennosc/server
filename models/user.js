import { Schema, model } from 'mongoose';

import { ensureFieldUniquity, accountOfEmail, todaysActivity } from "./utils";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true},
    gusPowiatUnitId: { type: String, default: "000000000000" },
    gusVoivodeshipUnitId: { type: String, default: "000000000000" }
});


UserSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("email"));

UserSchema.methods = {todaysActivity};

UserSchema.static("accountOfEmail", accountOfEmail);

export default model('user', UserSchema);
