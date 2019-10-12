import {mergeVariablesWithUnits, saveUnits, applyNormalizersToVariables} from "./utils";
import {getAllUnitsOfLevel, grabVariablesForUnitOfLevel} from "./apiCallingUtils";
import {neededVoivodeshipVariables, neededPowiatVariables, voivodeshipNormalizers, powiatNormalizers} from "./config";

export default async () => {

    const assemblePromises = [assembleDetailedPowiaty(), assembleDetailedVoivodeships()];
    const [detailedPowiaty, detailedVoivodeships] = await Promise.all(assemblePromises);



    const detailedUnits = {...detailedPowiaty, ...detailedVoivodeships};

    await saveUnits(detailedUnits);
}

const assembleDetailedVoivodeships = async () => {
    const allVoivodeships = await getAllUnitsOfLevel("2");
    const voivodeshipVariables = await grabVariablesForUnitOfLevel("2", neededVoivodeshipVariables);
    const mergedVoivodeships = mergeVariablesWithUnits(voivodeshipVariables, allVoivodeships);
    return applyNormalizersToVariables(voivodeshipNormalizers, mergedVoivodeships);
};

const assembleDetailedPowiaty = async () => {
    const allPowiaty = await getAllUnitsOfLevel("5");
    const powiatyVariables = await grabVariablesForUnitOfLevel("5", neededPowiatVariables);
    const mergedVariables = mergeVariablesWithUnits(powiatyVariables, allPowiaty);
    return applyNormalizersToVariables(powiatNormalizers, mergedVariables);
}
