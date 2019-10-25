import { Schema, model } from 'mongoose';

import ensureFieldUniquity from "./utils/ensureFieldUniquity";
import { accountOfPayload, todaysActivity, updateWithUnits } from "./utils";
import {hashPassword, hashPasswordAfterUpdate, checkPassword} from "./utils/user/password";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    password: { type: String, required: false },


    gusPowiatUnitId: { type: String, default: "000000000000" },
    gusVoivodeshipUnitId: { type: String, default: "000000000000" },

    streak: { type: Number, default: 0},

    activitySubmissionsCount: {type: Number, default: 0},

    totalSavings: {
      plastic: {type: Number, default: 0},
      water: {type: Number, default: 0},
      carbon: {type: Number, default: 0}
    },

    lifestyleBetterThan: {
      neighbours: {type: Number, default: 50},
      poles: {type: Number, default: 50},
      europeans: {type: Number, default: 50}
    },

    todaysSavings: {water: Number, plastic: Number, carbon: Number}
});


UserSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("email"));

UserSchema.pre('save', hashPassword);
UserSchema.pre('findOneAndUpdate', hashPasswordAfterUpdate);

UserSchema.methods = {todaysActivity, checkPassword};

UserSchema.static("accountOfPayload", accountOfPayload);
UserSchema.static("updateWithUnits", updateWithUnits);

export default model('user', UserSchema);
