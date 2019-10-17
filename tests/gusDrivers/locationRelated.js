import chai, {expect} from 'chai';
import chaiHttp  from 'chai-http'

import getMatchingUnitsFromCoordinates from "../../gusDrivers/unitFinding/getMatchingUnitsFromCoordinates";


let should = chai.should();
chai.use(chaiHttp);


describe('GUS location and unit-id related functions', function() {

    this.timeout(10000);

    describe("The getMatchingUnitsFromCoordinates function responsible for the initial communication", () => {

        it("Should return Powiat Miasta Warszawa and set user's gusIds.", done => {
            const warsawCoordinates = "52.231246, 21.004800";

            getMatchingUnitsFromCoordinates(warsawCoordinates).then( matchingUnits => {

                expect(matchingUnits).to.be.an("object");
                expect(Object.keys(matchingUnits)).to.have.lengthOf(2);

                expect(matchingUnits.voivodeship).to.deep.include({
                    isVoivodeship: true,
                    gusId: "071400000000",
                    name: "MAZOWIECKIE"
                });


                expect(matchingUnits.powiaty).to.be.an("array").of.length(1);
                expect(matchingUnits.powiaty[0]).to.deep.include({
                    isVoivodeship: false,
                    gusId: "071412865000",
                    voivodeshipGusId: "071400000000"
                });


                done();
            })
        })
    })
});
