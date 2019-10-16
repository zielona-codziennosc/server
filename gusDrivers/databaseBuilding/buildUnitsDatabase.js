import {
    mergeVariablesWithUnits,
    saveUnits,
    applyNormalizersToVariables,
    smashVoivodeshipAndPowiatVariables
} from "./utils";

import {normalizers} from "./config";
import getAllUnits from "./unitGrabbing";
import getAllVariables from "./variableGrabbing";

export default async () => {

    const [allVariablesRaw, allUnitsRaw] = await Promise.all([getAllVariables(), getAllUnits()]);


    const unitsMergedWithVariables = mergeVariablesWithUnits(allVariablesRaw, allUnitsRaw);


    const assembledUnits = applyNormalizersToVariables(normalizers, unitsMergedWithVariables);


    await saveUnits(assembledUnits);
    console.log("Done building the database.");
}
