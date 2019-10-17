import Unit from "../../../models/unit";


export const mergeVariablesWithUnits = (variables, units) => {

    for(const unitId in units) {
        const currentUnit = units[unitId];

        for(const variableName in variables) {

            const currentVariable = variables[variableName];

            currentUnit[variableName] = currentVariable?.[unitId]?.value;
        }
    }

    return units;
};

export const joinVariablesById = variables => {

    const smashed = {};

    for(const variableName in variables) {
        const currentVariable = variables[variableName];

        for(const unitId in currentVariable) {
            if(!smashed[unitId])
                smashed[unitId] = {id: unitId};
            smashed[unitId][variableName] = currentVariable[unitId].value;
        }
    }

    return smashed;
};

export const joinVariablesOfDifferentUnits = (firstUnitVariables, secondUnitVariables) => {
    const smashed = {};
    for(const variableName in firstUnitVariables) {
            smashed[variableName] = {...firstUnitVariables[variableName], ...secondUnitVariables[variableName]}
    }
    return smashed;
};

export const saveUnits = async (units) => {
    const savePromises = [];

    for(const gusId in units) {
        const currentUnit = new Unit({gusId, ...units[gusId]});
        savePromises.push(currentUnit.save());
    }

    await Promise.all(savePromises);
};

export const updateUnits = async (units) => {
    const updatePromises = [];

    for(const gusId in units)
        updatePromises.push(Unit.updateOne({gusId}, units[gusId]));

    await Promise.all(updatePromises);
};

export const applyNormalizersToVariables = (normalizers, variables) => {
    Object.values(variables).forEach( variable => {
        normalizers.forEach(normalizer =>  {
            if(normalizer(variable) === "remove")
                delete variables[variable.id];
        });
    });
    return variables;
};

export const injectVoivodeshipIdToPowiaty = (voivodeshipId, powiaty) => Object.values(powiaty).forEach(powiat => powiat.voivodeshipGusId = voivodeshipId);

export const stampVoivodeshipsFlag = voivodeships => voivodeships.forEach( voivodeship => voivodeship.isVoivodeship = true);

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const normalizeGusResultArray = resultArray => resultArray.reduce( (result, item) =>{
    result[item.id] = item;
    if(item.values) {
        result[item.id].value = item.values[0].val;
        delete result[item.id].values;
    }
    return result;
}, {});

export {default as getAllUnits} from "./unitGrabbing";
export {default as getAllVariables} from "./variableGrabbing";
