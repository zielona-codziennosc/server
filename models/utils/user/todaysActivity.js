import Unit from "../../unit";

export default async function({waterConsumption, commute, plasticWeight}) {

    const [powiat, voivodeship] = await Promise.all(
        [
            Unit.findOne({gusId: this.gusPowiatUnitId}),
            Unit.findOne({gusId: this.gusVoivodeshipUnitId})
        ]
    );

    const unitWideWaterConsumption = powiat?.averageDailyWaterConsumption || voivodeship?.averageDailyWaterConsumption;
    const unitWidePlasticProduction = powiat?.averageDailyPlasticProduction || voivodeship?.averageDailyPlasticProduction;


    const usersWaterFactor = waterConsumption / unitWideWaterConsumption;
    const usersPlasticFactor = plasticWeight / unitWidePlasticProduction;
    const carbonSavings = footprintDifference(commute, voivodeship.dailyCarbonFootprintNow, voivodeship.dailycarbonFootprintWithPublicTransport,voivodeship.dailycarbonFootprintWithAllCars)


    if(!this.todaysSavings && usersWaterFactor > 1 || usersPlasticFactor > 1)
        this.streak = 0;
    else
        this.streak++;

    if(this.todaysSavings) {
        this.totalPlasticSaved -= this.todaysSavings.plastic;
        this.totalWaterSaved -= this.todaysSavings.water;
        this.totalCarbonSaved -= this.todaysSavings.carbon;
    }

    const plasticSavings = unitWidePlasticProduction - plasticWeight;
    const waterSavings = unitWideWaterConsumption - waterConsumption;

    this.totalPlasticSaved += plasticSavings;
    this.totalWaterSaved += waterSavings;
    this.totalCarbonSaved +=  carbonSavings;

    this.todaysSavings = {plastic: plasticSavings, water: waterSavings, carbon: carbonSavings};

    await this.save();

    return {usersWaterFactor, usersPlasticFactor, carbonSavings};
}

const footprintDifference = (commute, now, withPublicTransport, withCarsOnly) => {
    switch(commute) {
        case "eco": return now;
        case "bus": return now - withPublicTransport;
        case "car": return now - withCarsOnly;
    }
};
