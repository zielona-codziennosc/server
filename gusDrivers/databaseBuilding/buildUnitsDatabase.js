import {mergeVariablesWithUnits, saveUnits} from "./utils";
import {getAllUnitsOfLevel, grabVariablesForUnitOfLevel} from "./apiCallingUtils";

const neededPowiatVariables = {
    "waterConsumptionPerCapita": 455420,
    "recycledWastePerCapita": 455419,
    "wastePerCapita": 54842
};

const neededVoivodeshipVariables = {
    "publicTransportRidesPerCapita": 634994
};

export default async () => {

    const allPowiaty = await getAllUnitsOfLevel("5");
    const allVoivodeships = await getAllUnitsOfLevel("2");

    const powiatyVariables = await grabVariablesForUnitOfLevel("5", neededPowiatVariables);
    const voivodeshipVariables = await grabVariablesForUnitOfLevel("2", neededVoivodeshipVariables);

    const detailedVoivodeships = mergeVariablesWithUnits(voivodeshipVariables, allVoivodeships);
    const detailedPowiaty = mergeVariablesWithUnits(powiatyVariables, allPowiaty);

    const detailedUnits = {...detailedPowiaty, ...detailedVoivodeships};

    console.log(detailedUnits);

    await saveUnits(detailedUnits);

}
