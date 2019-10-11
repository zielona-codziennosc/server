export const powiatNormalizers = [
    entity => !entity.population && "remove",
    entity => (entity.averageDailyWaterConsumption = Math.round((entity.waterConsumptionPerCapita * 1000) / 365)) && delete entity.waterConsumptionPerCapita,
    entity => (entity.averageDailyWasteProduction = Number(Number((entity.wastePerCapita / entity.population)*1000 / 365).toFixed(2) )) && delete entity.wastePerCapita,
];

export const voivodeshipNormalizers = [
    entity => !entity.population && "remove",
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

