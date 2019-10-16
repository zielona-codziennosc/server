import {smashVariables, applyNormalizersToVariables, updateUnits} from "./utils";
import {grabVariablesForUnitOfLevel} from "./unitGrabbing";
import {neededVoivodeshipVariables, neededPowiatVariables, voivodeshipNormalizers, powiatNormalizers} from "./config";


export default async () => {
    const assemblePromises = [assemblePowiatUpdate(), assembleVoivodeshipVariables()];

    const [powiatUpdates, voivodeshipUpdates] = await Promise.all(assemblePromises);

    await updateUnits({...powiatUpdates, ...voivodeshipUpdates});
    console.log("Done updating the database.");
};

const assemblePowiatUpdate = async () => {
    let powiatVariables = await grabVariablesForUnitOfLevel("5", neededPowiatVariables);

    powiatVariables = smashVariables(powiatVariables);

    return applyNormalizersToVariables(powiatNormalizers, powiatVariables);
};

const assembleVoivodeshipVariables = async () => {
    let voivodeshipVariables = await grabVariablesForUnitOfLevel("2", neededVoivodeshipVariables);

    voivodeshipVariables = smashVariables(voivodeshipVariables);

    return applyNormalizersToVariables(voivodeshipNormalizers, voivodeshipVariables);
};
