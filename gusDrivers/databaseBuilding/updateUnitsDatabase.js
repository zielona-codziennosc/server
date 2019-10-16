import {
    joinVariablesById,
    applyNormalizersToVariables,
    updateUnits,
    getAllVariables
} from "./utils";

import { normalizers } from "./config";


export default async () => {
    const assembledUpdates = await assembleAll();

    await updateUnits(assembledUpdates);

    console.log("Successfuly updated units.");
};


const assembleAll = async() => {
    const allVariables = await getAllVariables();
    const variablesJoinedOnId = joinVariablesById(allVariables);

    return applyNormalizersToVariables(normalizers, variablesJoinedOnId);
};
