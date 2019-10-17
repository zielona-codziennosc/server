import chai, {expect} from 'chai';
import chaiHttp from "chai-http";
import dotenv from "dotenv";
import {joinVariablesById} from "../../gusDrivers/databaseBuilding/utils";


dotenv.config();

let should = chai.should();
chai.use(chaiHttp);


describe('Database updating utilities', function() {

    this.timeout(10000);


    it("mergeVariablesWithUnits function: should merge variables with their respective units by their id", done => {
        const joinedVariables = joinVariablesById(sampleAllVariables);

        const sochaczewId = "071427328000";
        expect(joinedVariables[sochaczewId]).to.deep.equal({
            id: sochaczewId,
            population: sampleAllVariables.population[sochaczewId].value,
            recycledWastePercentage: sampleAllVariables.recycledWastePercentage[sochaczewId].value
        });

        const zyrardowId = "071427338000";
        expect(joinedVariables[zyrardowId]).to.deep.equal({
            id: zyrardowId,
            population: sampleAllVariables.population[zyrardowId].value,
            recycledWastePercentage: sampleAllVariables.recycledWastePercentage[zyrardowId].value
        });

        done();
    });


});




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
