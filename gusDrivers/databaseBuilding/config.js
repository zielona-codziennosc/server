const sharedVariables = {
    "population": {variableId: 453949, year: 2011},
    "waterConsumptionPerCapita": {variableId: 455420, year: 2018},
    "industrialShareOfUsedWater": {variableId: 450559, year: 2018},
    "recycledWastePercentage": {variableId: 455419, year: 2018},
    "wastePerCapita": {variableId: 54842, year: 2018},
};

export const neededPowiatVariables = {
    ...sharedVariables
};

export const neededVoivodeshipVariables = {
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
    entity => (entity.averageDailyPlasticProduction = Number((Number((entity.wastePerCapita / entity.population)*1000 / 365) * 0.12).toFixed(2) )) && delete entity.wastePerCapita,
];

export const powiatNormalizers = [
    ...sharedNormalizers
].map( (normalizer) => entity => !entity.isVoivodeship && normalizer(entity));

export const voivodeshipNormalizers = [
    ...sharedNormalizers,
    entity => entity.isVoivodeship = true,
    entity => {
        //first we normalize the value; in this case it's given in millions
        entity.publicTransportRidesPerCapita *= 1000000;
        //We estimate the number of public transport rides in working days only, and then divide it by the number of working days
        const dailyPublicCommuters = Math.round((entity.publicTransportRidesPerCapita / (365+114)) / 2);
        const totalCommuters = Math.round(entity.workingAgePopulation * ((100 - entity.unemploymentRate )/ 100));


        entity.dailyCarbonFootprintNow = Math.round((dailyPublicCommuters * 0.069) + ((totalCommuters - dailyPublicCommuters) * 0.133));
        entity.dailycarbonFootprintWithPublicTransport = Math.round(totalCommuters * 0.069);
        entity.dailycarbonFootprintWithAllCars = Math.round(totalCommuters * 0.133);
    }
].map( normalizer => entity => entity.isVoivodeship && normalizer(entity));


export const neededVariables = {neededVoivodeshipVariables, neededPowiatVariables};

export const normalizers = [...powiatNormalizers, ...voivodeshipNormalizers];
