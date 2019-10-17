import chai, {expect} from 'chai';
import chaiHttp from "chai-http";
import {
    applyNormalizersToVariables,
    mergeVariablesWithUnits,
    normalizeGusResultArray
} from "../../gusDrivers/databaseBuilding/utils";
import dotenv from "dotenv";


dotenv.config();

let should = chai.should();
chai.use(chaiHttp);


describe('Database building utilities', function() {

    this.timeout(10000);

    it("mergeVariablesWithUnits function: should merge variables with their respective units by their id", done => {

        const unitsMergedWithVariables = mergeVariablesWithUnits(sampleAllVariables, sampleAllUnits);

        const sochaczewskiPowiatId = "071427328000";
        const populationAfterMerge = unitsMergedWithVariables[sochaczewskiPowiatId].population;
        const populationBeforeMerge = sampleAllVariables.population[sochaczewskiPowiatId].value;

        expect(populationAfterMerge).to.equal(populationBeforeMerge);


        const zyrardowskiPowiatId = "071427338000";
        const recycledWasteBeforeMerge = unitsMergedWithVariables[zyrardowskiPowiatId].recycledWastePercentage;
        const recycledWasteAfterMerge = sampleAllVariables.recycledWastePercentage[zyrardowskiPowiatId].value;

        expect(recycledWasteBeforeMerge).to.equal(recycledWasteAfterMerge);

        done();
    });

    it("applyNormalizersToVariables function: should apply given normalizers to all units", done => {

        const unitsMergedWithVariables = mergeVariablesWithUnits(sampleAllVariables, sampleAllUnits);

        const assembledUnits = applyNormalizersToVariables([entity => entity.ihavebeenhere = true], unitsMergedWithVariables);

        let allUnitsHaveBeenStamped = true;

        Object.entries(assembledUnits).forEach( unit => !unit.ihavebeenhere && (allUnitsHaveBeenStamped = false));

        expect(allUnitsHaveBeenStamped);

        done();
    });

    it("normalizeGusResultArray function: should forge an array into an object where keys are unit's ids", done => {

        const strawmanGusResult = [{id: "jeden"}, {id: "dwa"}, {id: "trzy"}];

        const normalizedStrawman = normalizeGusResultArray(strawmanGusResult);

        expect(normalizedStrawman).to.deep.equal({
                jeden: { id: 'jeden' },
                dwa: { id: 'dwa' },
                trzy: { id: 'trzy' }
            });

        done();
    })

});



const sampleAllUnits = {
    '071427328000': {
        id: '071427328000',
        name: 'Powiat sochaczewski',
        parentId: '071427300000',
        level: 5,
        kind: '1',
        hasDescription: false,
        voivodeshipGusId: '071400000000'
    },
    '071427338000': {
        id: '071427338000',
        name: 'Powiat żyrardowski',
        parentId: '071427300000',
        level: 5,
        kind: '1',
        hasDescription: false,
        voivodeshipGusId: '071400000000'
    }
};

const sampleAllVariables =
    {
        population: {
            "071427328000": {
                id: "071427328000",
                name: "Powiat sochaczewski",
                value: 85118.0
            },
            "071427338000": {
                id: "071427338000",
                name: "Powiat żyradowski",
                value: 76496.0
            }
        },
        recycledWastePercentage: {
            "071427328000": {
                id: "071427328000",
                name: "Powiat sochaczewski",
                value: 39.5
            },
            "071427338000": {
                id: "071427338000",
                name: "Powiat żyradowski",
                value: 23.1
            }
        }

    };
