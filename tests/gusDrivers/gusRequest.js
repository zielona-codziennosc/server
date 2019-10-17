import chai, {expect} from 'chai';
import chaiHttp from "chai-http";

import gusRequest from "../../gusDrivers/gusRequest";


let should = chai.should();
chai.use(chaiHttp);


describe('GUS drivers utility functions', function() {

    this.timeout(10000);

    describe("The gusRequest function", () => {

        it("Should work with queryString (as an object) argument", done => {

            gusRequest("/Units", {level: "5", "page": "0", "page-size": "30"})
                .then( response => {

                    expect(response).to.be.an("object");
                    expect(response.pageSize).to.equal(30);

                    expect(response.results).to.be.an("array").of.length(30);

                    expect(response.results[0]).to.have.property("parentId");

                    done();
                })

        });

        it("Should work with one argument only (the path)", done => {

            gusRequest("/Units", )
                .then( response => {

                    expect(response).to.be.an("object");

                    expect(response.results).to.be.an("array");

                    expect(response.results[0]).to.have.property("id");

                    done();
                })

        })

    });




});
