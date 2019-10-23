import Unit from "../../unit";

export default async function(usages) {

    adjustForLeftoverSavings(this);

    this.activitySubmissionsCount += 1;

    const [powiat, voivodeship] = await Promise.all(
        [
            Unit.findOne({gusId: this.gusPowiatUnitId}),
            Unit.findOne({gusId: this.gusVoivodeshipUnitId})
        ]
    );
    const bundledUsages = {voivodeship, powiat, usages};

    setTodaysSavings(this, bundledUsages);
    setTotalScores(this);

    await this.save();

    return {relativeScores: calculateRelativeScores(this, bundledUsages), totalSavings: this.totalSavings};
}

const adjustForLeftoverSavings = document => {

    if(document?.todaysSavings?.carbon) {
        Object.entries(document.todaysSavings).forEach(([savedAsset, savings]) => {
            document.totalSavings[savedAsset] -= savings;
        });
        document.activitySubmissionsCount -= 1;
    }
};

const setTotalScores = document => {
    Object.entries(document.todaysSavings).forEach(([savedAsset, savings]) => {
        document.totalSavings[savedAsset] = (document?.totalSavings?.[savedAsset] || 0) + savings;
    })
};

const setTodaysSavings = (document, {voivodeship, powiat, usages: {plasticWeight, waterConsumption, commute}}) => {
    const {unitWideWaterConsumption, unitWidePlasticProduction} = getUnitWideConsumptions(powiat, voivodeship);

    document.todaysSavings = {
        plastic: unitWidePlasticProduction - plasticWeight,
        water: unitWideWaterConsumption - waterConsumption,
        carbon: footprintDifference(commute, voivodeship)
    };
};

const calculateRelativeScores = (document, {powiat, voivodeship, usages: {waterConsumption, plasticWeight}}) => {
    const {unitWideWaterConsumption, unitWidePlasticProduction} = getUnitWideConsumptions(powiat, voivodeship);

    return {
        waterConsumptionBetterBy: betterThan(waterConsumption, unitWideWaterConsumption),
        plasticProductionBetterBy: betterThan(plasticWeight, unitWidePlasticProduction),
        commuteWouldCutCarbonEmmissionsBy: percentageOf(document.todaysSavings.carbon, voivodeship.dailyCarbonFootprintNow),
        commuteWouldCutCarbonEmmissionsByAbsolute: document.todaysSavings.carbon
    };
};

const getUnitWideConsumptions = (powiat, voivodeship) => ({
    unitWideWaterConsumption: powiat?.averageDailyWaterConsumption || voivodeship?.averageDailyWaterConsumption,
    unitWidePlasticProduction: powiat?.averageDailyPlasticProduction || voivodeship?.averageDailyPlasticProduction
});

const betterThan = (lhs, rhs) => 100 - percentageOf(lhs, rhs);
const percentageOf = (lhs, rhs) => twoLeadingZeroes((lhs / rhs) * 100);
const twoLeadingZeroes = number => Number(number.toFixed(2));

const footprintDifference = (commute, {dailyCarbonFootprintNow, dailycarbonFootprintWithPublicTransport, dailycarbonFootprintWithAllCars}) => {
    switch(commute) {
        case "eco": return dailyCarbonFootprintNow;
        case "bus": return dailyCarbonFootprintNow - dailycarbonFootprintWithPublicTransport;
        case "car": return dailyCarbonFootprintNow - dailycarbonFootprintWithAllCars;
    }
};
