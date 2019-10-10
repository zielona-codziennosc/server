import { Schema, model } from 'mongoose';

import { ensureFieldUniquity } from "./utils";

const UnitSchema = new Schema({
    gusId: { type: String},
    name: {type: String},
    averageFriendliness: { type: Number, default: 1 },
    averageStreak: {type: Number, default: 0 },
    population: {type: Number},
    waterConsumptionPerCapita: {type: Number},
    recycledWastePerCapita: {type: Number},
    publicTransportRidesPerCapita: {type: Number},
    wastePerCapita: {type: Number}
});

UnitSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("gusId"));

export default model('Unit', UnitSchema);
