const sharedVariables = {
    "waterConsumptionPerCapita": {variableId: 455420, year: 2018},
    "industrialShareOfUsedWater": {variableId: 450559, year: 2018},
    "recycledWastePercentage": {variableId: 455419, year: 2018},
    "wastePerCapita": {variableId: 54842, year: 2018},
};

export const neededPowiatVariables = {
    "population": {variableId: 453949, year: 2011},
    ...sharedVariables
};

export const neededVoivodeshipVariables = {
    "population": {variableId: 453949, year: 2011},
    "workingAgePopulation": {variableId: 72292, year: 2018},
    "unemploymentRate": {variableId: 60270, year: 2018},
    "publicTransportRidesPerCapita": {variableId: 498861, year: 2018},
    ...sharedVariables
};

const sharedNormalizers = [
    entity => !entity.population && "remove",
    entity => {
        const dailyLitersPerCapita = (entity.waterConsumptionPerCapita * 1000) / 365;

        //Since the data is missing for some units, we have to assume their household use of water is about 0.9, because almost all of these units (i.e. powiat golubsko-dobrzynski) are non-industrialized.
        const householdUse = entity.industrialShareOfUsedWater ? ((100 - entity.industrialShareOfUsedWater) / 100) : 0.9;

        entity.averageDailyWaterConsumption = Math.round(dailyLitersPerCapita * householdUse);

        delete entity.waterConsumptionPerCapita;
        delete entity.industrialShareOfUsedWater;
    },
    entity => (entity.averageDailyWasteProduction = Number(Number((entity.wastePerCapita / entity.population)*1000 / 365).toFixed(2) )) && delete entity.wastePerCapita,
];

export const powiatNormalizers = [
    ...sharedNormalizers
];

export const voivodeshipNormalizers = [
    ...sharedNormalizers,
    entity => {
        //first we normalize the value; in this case it's given in millions
        entity.publicTransportRidesPerCapita *= 1000000;
        //We estimate the number of public transport rides in working days only, and then divide it by the number of working days
        const dailyEcoCommuters = ((entity.publicTransportRidesPerCapita / (365+114)) / 2);
        const totalCommuters = Math.round(entity.workingAgePopulation * ((100 - entity.unemploymentRate )/ 10000));

        delete entity.publicTransportRidesPerCapita;
        delete entity.workingAgePopulation;
        delete entity.unemploymentRate;

        //since we applied discriminatory effects on our variable, we have to express the best-case scenario now by adding a constant to our value
        entity.ecoCommutersPercentage = Math.round(dailyEcoCommuters / totalCommuters) + 20;
    }
];

