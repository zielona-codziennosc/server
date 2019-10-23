import { Schema, model } from 'mongoose';

import ensureFieldUniquity from "./utils/ensureFieldUniquity";
import { accountOfEmail, todaysActivity, updateWithUnits } from "./utils";

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true},

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

UserSchema.methods = {todaysActivity};

UserSchema.static("accountOfEmail", accountOfEmail);
UserSchema.static("updateWithUnits", updateWithUnits);

export default model('user', UserSchema);
