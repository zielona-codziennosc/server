import {smashVariables, applyNormalizersToVariables, updateUnits} from "./utils";
import {grabVariablesForUnitOfLevel} from "./apiCallingUtils";
import {voivodeshipNormalizers, powiatNormalizers} from "./normalizers";
import {neededVoivodeshipVariables, neededPowiatVariables} from "./neededVariables";



export default async () => {

    const assemblePromises = [assemblePowiatUpdate(), assembleVoivodeshipVariables()];

    const [powiatUpdates, voivodeshipUpdates] = await Promise.all(assemblePromises);

    await updateUnits({...powiatUpdates, ...voivodeshipUpdates});
}

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
