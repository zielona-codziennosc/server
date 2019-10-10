import { Schema, model } from 'mongoose';

import { ensureFieldUniquity } from "./utils";

const UnitSchema = new Schema({
    gusId: { type: String},
    averageFriendliness: { type: Number, default: 1 },
    averageStreak: {type: Number, default: 0 },
    population: {type: Number}
});

UnitSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("gusId"));

export default model('Unit', UnitSchema);
