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

    const assemblePromises = [assembleDetailedPowiaty(), assembleDetailedVoivodeships()];
    const [detailedPowiaty, detailedVoivodeships] = await Promise.all(assemblePromises);

    const detailedUnits = {...detailedPowiaty, ...detailedVoivodeships};


    await saveUnits(detailedUnits);
}

const assembleDetailedVoivodeships = async () => {
    const allVoivodeships = await getAllUnitsOfLevel("2");
    const voivodeshipVariables = await grabVariablesForUnitOfLevel("2", neededVoivodeshipVariables);
    return mergeVariablesWithUnits(voivodeshipVariables, allVoivodeships);
};

const assembleDetailedPowiaty = async () => {
    const allPowiaty = await getAllUnitsOfLevel("5");
    const powiatyVariables = await grabVariablesForUnitOfLevel("5", neededPowiatVariables);
    return mergeVariablesWithUnits(powiatyVariables, allPowiaty);
}
