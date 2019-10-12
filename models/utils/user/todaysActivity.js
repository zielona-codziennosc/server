import Unit from "../../unit";

export default async function({waterConsumption, commute, plasticWeight}) {

    const [powiat, voivodeship] = await Promise.all(
        [
            Unit.findOne({gusId: this.gusPowiatUnitId}),
            Unit.findOne({gusId: this.gusVoivodeshipUnitId})
        ]
    );

    const usersWaterFactor = ecoFactor(waterConsumption, powiat?.averageDailyWaterConsumption || voivodeship?.averageDailyWaterConsumption);
    const usersPlasticFactor = ecoFactor(plasticWeight, powiat?.averageDailyPlasticProduction || voivodeship?.averageDailyPlasticProduction);
    const usersFootprintSavings = footprintDifference(commute, voivodeship.dailyCarbonFootprintNow, voivodeship.dailycarbonFootprintWithPublicTransport,voivodeship.dailycarbonFootprintWithAllCars)

    return {usersWaterFactor, usersPlasticFactor, usersFootprintSavings};
}

const ecoFactor = (userWater, averageWater) => userWater / averageWater;

const footprintDifference = (commute, now, withPublicTransport, withCarsOnly) => {
    switch(commute) {
        case "eco": return now;
        case "bus": return now - withPublicTransport;
        case "car": return now - withCarsOnly;
    }
};
