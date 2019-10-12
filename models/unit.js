import { Schema, model } from 'mongoose';

import ensureFieldUniquity from "./utils/ensureFieldUniquity";

const UnitSchema = new Schema({
    gusId: { type: String},
    name: {type: String},
    isVoivodeship: {type: Boolean, default: false},
    averageFriendliness: { type: Number, default: 1 },
    averageStreak: {type: Number, default: 0 },

    population: {type: Number},
    averageDailyWaterConsumption: {type: Number},
    averageDailyPlasticProduction: {type: Number},
    recycledWastePercentage: {type: Number},

    dailyCarbonFootprintNow: {type: Number},
    dailycarbonFootprintWithPublicTransport: {type: Number}, //They are both in kilogrammes
    dailycarbonFootprintWithAllCars: {type: Number}
}, {strict: true});

UnitSchema.pre(['save', 'findOneAndUpdate', 'findByIdAndUpdate'], ensureFieldUniquity("gusId"));

export default model('Unit', UnitSchema);
