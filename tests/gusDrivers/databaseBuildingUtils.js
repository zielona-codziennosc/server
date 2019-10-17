import chai, {expect} from 'chai';
import chaiHttp from "chai-http";
import {mergeVariablesWithUnits} from "../../gusDrivers/databaseBuilding/utils";
import dotenv from "dotenv";
import unit from "../../models/unit";


dotenv.config();

let should = chai.should();
chai.use(chaiHttp);


describe('Database building utilities', function() {

    this.timeout(10000);

    describe("The gusRequest function", () => {

        it("Should merge variables with their respective units by their id", done => {

            const unitsMergedWithVariables = mergeVariablesWithUnits(sampleAllVariables, sampleAllUnits);

            const sochaczewskiPowiatId = "071427328000";
            const populationAfterMerge = unitsMergedWithVariables[sochaczewskiPowiatId].population;
            const populationBeforeMerge = sampleAllVariables.population[sochaczewskiPowiatId];

            expect(populationAfterMerge).to.equal(populationBeforeMerge);

            const zyrardowskiPowiatId = "071427338000";
            const recycledWasteBeforeMerge = unitsMergedWithVariables[zyrardowskiPowiatId].recycledWastePercentage;
            const recycledWasteAfterMerge = sampleAllVariables.recycledWastePercentage[zyrardowskiPowiatId];

            expect(recycledWasteBeforeMerge).to.equal(recycledWasteAfterMerge);

            done();
        });

        it("Should work with one argument only (the path)", done => {


            done();
        })

    });




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
            },
        }

    };
