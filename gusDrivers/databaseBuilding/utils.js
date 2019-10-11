import gusRequest from "../gusRequest";
import Unit from "../../models/unit";

export const getAllUnitsOfLevel = async (level) => {

    let allUnits = [];

    for(let i=0; i<5; i++) {
        const unitsSheet = await gusRequest(`/units`, {level, page: i, "page-size": "100"});

        allUnits = [...allUnits, ...unitsSheet.results];

        if(!unitsSheet?.links?.next)
            break;
    }

    return allUnits;
};


export const grabStatisticalVariables = async () => {

    const neededVariables = {
        "waterConsumptionPerCapita": 455420,
        "recycledWastePerCapita": 455419,
        "publicTransportRidesPerCapita": 634994,
        "wastePerCapita": 54842
    };

    for(const variableName in neededVariables) {
        const variableId = neededVariables[variableName];
        neededVariables[variableName] = await grabSingleVariableForAllUnits(variableId)
    }

    return neededVariables;
};

export const grabSingleVariableForAllUnits = async (variableId) => {
    let variableRecords = [];

    for(let i=0; i<5; i++) {
        const variableSheet = await gusRequest(`/data/by-variable/${variableId}`,
            {"unit-level": "5", page: i, "page-size": "100", year: "2018"});

        variableRecords = [...variableRecords, ...variableSheet.results];

        if(!variableSheet?.links?.next)
            break;
    }

    return variableRecords;
};

export const mergeVariablesWithUnits = (variables, units) => {
    return units.map( unit => {

        for(const variableName in variables) {
            unit[variableName] = variables[variableName].find( variable => variable.id === unit.id)?.values?.[0]?.val;
        }
        const {hasDescription, kind, level, ...neededProperties} = unit;

        return {...neededProperties, gusId: neededProperties.id};
    });
};

export const saveUnits = async (units) => {
    const savePromises = [];

    for(let i=0; i<units.length; i++) {
        const currentUnit = new Unit({...units[i]});
        savePromises.push(currentUnit.save());
    }

    await Promise.all(savePromises);
};

export const updateUnitsWithVariables = async (variables) => {
    const updatePromises = [];

    for(const variableName in variables) {
        const records = variables[variableName];

        for(let i=0; i<records.length; i++) {
            const currentRecord = records[i];
            updatePromises.push(Unit.updateOne({gusId: currentRecord.id}, {[variableName]: currentRecord.values[0].val}));
        }

    }

    await Promise.all(updatePromises);
};
