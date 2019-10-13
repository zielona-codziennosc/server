import chai, {expect} from 'chai';
import chaiHttp  from 'chai-http'

import getMatchingUnitsFromCoordinates from "../../gusDrivers/unitFinding/getMatchingUnitsFromCoordinates";


let should = chai.should();
chai.use(chaiHttp);


describe('GUS location and unit-id related functions', function() {

    describe("The getMatchingUnitsFromCoordinates function responsible for the initial communication", () => {

        it("Should return 2 matching units: Warsaw powiat and Mazowieckie voivodeship", done => {
            const warsawCoordinates = "52.231246, 21.004800";

            getMatchingUnitsFromCoordinates(warsawCoordinates).then( matchingUnits => {

                expect(matchingUnits).to.be.an("array");
                expect(matchingUnits).to.have.lengthOf(2);

                const warsawPowiat = matchingUnits.find(unit => unit.name === "Powiat m. st. Warszawa");
                const mazowieckieVoivodeship = matchingUnits.find(unit => unit.name === "MAZOWIECKIE");

                expect(warsawPowiat).to.exist;
                expect(mazowieckieVoivodeship).to.exist;

                done();
            })
        })
    })
});
