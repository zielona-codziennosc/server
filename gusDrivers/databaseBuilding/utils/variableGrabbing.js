import gusRequest from "../../gusRequest";
import { neededVariables } from "../config";
import {normalizeGusResultArray, joinVariablesOfDifferentUnits} from "./index"

export const getAllVariables = async () => {

    const {neededPowiatVariables, neededVoivodeshipVariables} = neededVariables;

    const [powiatVariables, voivodeshipVariables] = await Promise.all([
        grabVariablesForUnitOfLevel("5", neededPowiatVariables),
        grabVariablesForUnitOfLevel("2", neededVoivodeshipVariables)
    ]);


    return joinVariablesOfDifferentUnits(voivodeshipVariables, powiatVariables);
}

export const grabVariablesForUnitOfLevel = async (level, requestedVariables) => {

    const resultingVariables = {};

    for(const variableName in requestedVariables) {
        const {variableId, year} = requestedVariables[variableName];
        resultingVariables[variableName] = await grabOneVariableForUnitOfLevel(level, variableId, year)
    }

    return resultingVariables;
};

export const grabOneVariableForUnitOfLevel = async (level, variableId, year) => {
    let variableRecords = [];

    for(let i=0; i<5; i++) {
        const variableSheet = await gusRequest(`/data/by-variable/${variableId}`,
            {"unit-level": level, page: i, "page-size": "100", year});


        variableRecords = [...variableRecords, ...variableSheet.results];

        if(!variableSheet?.links?.next)
            break;
    }

    return normalizeGusResultArray(variableRecords);
};
