import {
    mergeVariablesWithUnits,
    saveUnits,
    applyNormalizersToVariables,
    getAllUnits,
    getAllVariables
} from "./utils";

import {normalizers} from "./config";

export default async () => {

    const [allVariablesRaw, allUnitsRaw] = await Promise.all([getAllVariables(), getAllUnits()]);

    const unitsMergedWithVariables = mergeVariablesWithUnits(allVariablesRaw, allUnitsRaw);

    const assembledUnits = applyNormalizersToVariables(normalizers, unitsMergedWithVariables);

    await saveUnits(assembledUnits);
    console.log("Done building the database. Don't forget to remove the function call from your code, or it will rebuild on each subsequent restart");
}
