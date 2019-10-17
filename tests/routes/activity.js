import chai, {expect} from 'chai';
import chaiHttp  from 'chai-http'


import { User } from "../../models/";
import server from "../../index";
import jwt from "jsonwebtoken";

let should = chai.should();
chai.use(chaiHttp);


describe('Activity routes', function() {
    this.timeout(10000);

    const email = "admininternetu@example.com";
    let mockedUser, authenticationToken;

    beforeEach(async () => {
        await User.deleteMany({});

        mockedUser = new User({email, gusVoivodeshipUnitId: "060600000000", gusPowiatUnitId: "060611163000"});

        mockedUser = await mockedUser.save();

        authenticationToken = jwt.sign({email, id: mockedUser._id}, process.env.JWT_SECRET, {expiresIn: 60*10});
    });



    it("POST /user/:userId/coordinates | Should change user's gusId's and return Warsaw city powiat", (done) => {

        const warsawCoordinates = "52.218738, 21.009573";

        chai.request(server)
            .post(`/user/${mockedUser._id}/coordinates`)
            .set("Authorization", `Bearer ${authenticationToken}`)
            .send({
                coordinates: warsawCoordinates,
                set: true
            })
            .end(async (err, res) => {

                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.powiaty.should.be.an("array").of.length(1);

                expect(res.body.powiaty[0].name).to.equal("Powiat m. st. Warszawa");
                expect(res.body.voivodeship.name).to.equal("MAZOWIECKIE");
                expect(res.body.success);

                const mockedUserAfterUpdate = await User.findById(mockedUser._id);

                expect(mockedUserAfterUpdate.gusPowiatUnitId).to.equal(res.body.powiaty[0].gusId);
                expect(mockedUserAfterUpdate.gusVoivodeshipUnitId).to.equal(res.body.voivodeship.gusId);

                done();


            });
    });


    describe("Daily activity: POST /user/:userId/daily", function() {

        it("Should add daily activity to user's database record", done => {

            const dailyActivity = {
                waterConsumption: 120,
                plasticWeight: 2,
                commute: "eco"
            };

            chai.request(server)
                .post(`/user/${mockedUser._id}/daily`)
                .set("Authorization", `Bearer ${authenticationToken}`)
                .send(dailyActivity)
                .end(async (err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    expect(res.body.success);

                    res.body.data.should.be.an("object");

                    expect(res.body.data).to.have.property("totalPlasticSaved");
                    expect(res.body.data).to.have.property("totalWaterSaved");
                    expect(res.body.data).to.have.property("totalCarbonSaved");

                    expect(res.body.data).to.have.property("usersWaterFactor");
                    expect(res.body.data).to.have.property("usersPlasticFactor");
                    expect(res.body.data).to.have.property("carbonSavings");


                    done();
                });
        });

        it("Should not let an user boost their results by posting twice or more", done => {

            const dailyActivity = {
                waterConsumption: 120,
                plasticWeight: 2,
                commute: "eco"
            };

            chai.request(server)
                .post(`/user/${mockedUser._id}/daily`)
                .set("Authorization", `Bearer ${authenticationToken}`)
                .send(dailyActivity)
                .end(async (err, firstResponse) => {

                    chai.request(server)
                        .post(`/user/${mockedUser._id}/daily`)
                        .set("Authorization", `Bearer ${authenticationToken}`)
                        .send(dailyActivity)
                        .end(async (err, secondResponse) => {

                            secondResponse.status.should.equal(200);

                            secondResponse.body.data.should.deep.equal(firstResponse.body.data);

                            done();
                        });

                });
        })
    });



});
