import gusRequest from "../gusRequest";

export const getAllUnitsOfLevel = async (level) => {

    let allUnits = [];

    for(let i=0; i<5; i++) {
        const unitsSheet = await gusRequest(`/units`, {level, page: i, "page-size": "100"});

        allUnits = [...allUnits, ...unitsSheet.results];

        if(!unitsSheet?.links?.next)
            break;
    }


    return normalizeGusResultArray(allUnits);
};

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

const normalizeGusResultArray = resultArray => resultArray.reduce( (result, item) =>{
    result[item.id] = item;
    if(item.values) {
        result[item.id].value = item.values[0].val;
        delete result[item.id].values;
    }
    return result;
}, {});
