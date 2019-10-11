import {} from "./utils";
import {grabVariablesForUnitOfLevel} from "./apiCallingUtils";

const neededPowiatVariables = {
    "waterConsumptionPerCapita": 455420,
    "recycledWastePerCapita": 455419,
    "wastePerCapita": 54842
};

const neededVoivodeshipVariables = {
    "publicTransportRidesPerCapita": 634994
};


export default async () => {
    const powiatVariables = await grabVariablesForUnitOfLevel("5", neededPowiatVariables);
    const voivodeshipVariables = await grabVariablesForUnitOfLevel("2", neededVoivodeshipVariables);

    console.log(powiatVariables)


}
