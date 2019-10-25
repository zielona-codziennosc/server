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

    const localRelativeScores = calculateRelativeScores(this, bundledUsages);

    const globalRelativeScores = calculateGlobalRelativeScores(this, bundledUsages);

    await this.save();

    return {relativeScores: {...localRelativeScores, ...globalRelativeScores}, totalSavings: this.totalSavings};
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

    const thisTimeBetterThanPolesBy = betterThan(waterConsumption, unitWideWaterConsumption) + betterThan(plasticWeight, unitWidePlasticProduction);
    document.lifestyleBetterThan.neighbours = ((document.lifestyleBetterThan.poles * (document.activitySubmissionsCount - 1)) + thisTimeBetterThanPolesBy) / document.activitySubmissionsCount;


    return {
        waterConsumptionBetterBy: betterThan(waterConsumption, unitWideWaterConsumption),
        plasticProductionBetterBy: betterThan(plasticWeight, unitWidePlasticProduction),
        commuteWouldCutCarbonEmmissionsBy: percentageOf(document.todaysSavings.carbon, voivodeship.dailyCarbonFootprintNow),
        commuteWouldCutCarbonEmmissionsByAbsolute: document.todaysSavings.carbon
    };
};

const calculateGlobalRelativeScores = (document, {usages: {waterConsumption, plasticWeight}}) => {

    const {lifestyleBetterThan: {europeans, poles, neighbours}, activitySubmissionsCount} = document;

    const EUROPE_AVG_WATER_CONSUMPTION = 144;
    const EUROPE_AVG_PLASTIC_PRODUCTION = 0.084;

    const thisTimeBetterThanEuropeansBy = (betterThan(waterConsumption, EUROPE_AVG_WATER_CONSUMPTION) + betterThan(plasticWeight, EUROPE_AVG_PLASTIC_PRODUCTION)) / 2;

    document.lifestyleBetterThan.europeans = ((europeans * (activitySubmissionsCount - 1)) + thisTimeBetterThanEuropeansBy) / activitySubmissionsCount;

    const POLAND_AVG_WATER_CONSUMPTION = 150;
    const POLAND_AVG_PLASTIC_PRODUCTION = 0.95;

    const thisTimeBetterThanPolesBy = (betterThan(waterConsumption, POLAND_AVG_WATER_CONSUMPTION) + betterThan(plasticWeight, POLAND_AVG_PLASTIC_PRODUCTION)) / 2;
    document.lifestyleBetterThan.poles = ((poles * (activitySubmissionsCount - 1)) + thisTimeBetterThanPolesBy) / activitySubmissionsCount;

    return {thisTimeBetterThanEuropeansBy, thisTimeBetterThanPolesBy};
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
