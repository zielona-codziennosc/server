import {
    joinVariablesById,
    applyNormalizersToVariables,
    updateUnits,
    joinVariablesOfDifferentUnits,
    grabVariablesForUnitOfLevel
} from "./utils";

import {neededVoivodeshipVariables, neededPowiatVariables, normalizers} from "./config";


export default async () => {
    const assembledUpdates = await assembleAll();

    await updateUnits(assembledUpdates);

    console.log("Successfuly updated units.");
};


const assembleAll = async() => {
    const [voivodeships, powiaty] = await Promise.all(
        [grabVariablesForUnitOfLevel("2", neededVoivodeshipVariables),
            grabVariablesForUnitOfLevel("5", neededPowiatVariables)
        ]);
    const mergedVariables = joinVariablesOfDifferentUnits(voivodeships, powiaty);
    const variablesJoinedOnId = joinVariablesById(mergedVariables);

    return applyNormalizersToVariables(normalizers, variablesJoinedOnId);
};
