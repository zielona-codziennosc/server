import Unit from "../../models/unit";


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

export const smashVariables = variables => {

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


