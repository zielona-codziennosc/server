import { Schema, model } from 'mongoose';

import { ensureFieldUniquity } from "./utils";

const UnitSchema = new Schema({
    gusId: { type: String},
    name: {type: String},
    averageFriendliness: { type: Number, default: 1 },
    averageStreak: {type: Number, default: 0 },
    population: {type: Number},
    averageDailyWaterConsumption: {type: Number},
    averageDailyWasteProduction: {type: Number},
    recycledWastePercentage: {type: Number},
    ecoCommutersPercentage: {type: Number}
}, {strict: true});

UnitSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("gusId"));

export default model('Unit', UnitSchema);
