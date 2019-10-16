import { Schema, model } from 'mongoose';

import ensureFieldUniquity from "./utils/ensureFieldUniquity";
import { accountOfEmail, todaysActivity, updateWithUnits } from "./utils";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true},

    gusPowiatUnitId: { type: String, default: "000000000000" },
    gusVoivodeshipUnitId: { type: String, default: "000000000000" },

    streak: { type: Number, default: 0},
    totalPlasticSaved: { type: Number, default: 0},
    totalWaterSaved: { type: Number, default: 0},
    totalCarbonSaved: { type: Number, default: 0},

    todaysSavings: {water: Number, plastic: Number, carbon: Number}
});


UserSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("email"));

UserSchema.methods = {todaysActivity};

UserSchema.static("accountOfEmail", accountOfEmail);
UserSchema.static("updateWithUnits", updateWithUnits);

export default model('user', UserSchema);
