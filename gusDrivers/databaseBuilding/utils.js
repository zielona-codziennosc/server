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

export const saveUnits = async (units) => {
    const savePromises = [];

    for(let i=0; i<units.length; i++) {
        const currentUnit = new Unit({...units[i]});
        savePromises.push(currentUnit.save());
    }

    await Promise.all(savePromises);
};



