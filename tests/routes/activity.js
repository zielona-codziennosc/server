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

        mockedUser = new User({email});

        mockedUser = await mockedUser.save();

        authenticationToken = jwt.sign({email, id: mockedUser._id}, process.env.JWT_SECRET, {expiresIn: 60*10});
    });


    describe('POST /user/:userId/coordinates', () => {


        it("Should change user's gusId's and return Warsaw city powiat", (done) => {

            const warsawCoordinates = "52.218738, 21.009573";

            mockedUser.save().then(() => {
                chai.request(server)
                    .post(`/user/${mockedUser._id}/coordinates`)
                    .set("Authorization", `Bearer ${authenticationToken}`)
                    .send({
                        coordinates: warsawCoordinates,
                        set: true
                    })
                    .end(async (err, res) => {

                        console.log(res.body.powiaty);

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.powiaty.should.be.an("array").of.length(1);

                        expect(res.body.powiaty[0].name).to.equal("Powiat m. st. Warszawa");
                        expect(res.body.success);

                        const mockedUserAfterUpdate = await User.findById(mockedUser._id);

                        expect(mockedUserAfterUpdate.gusPowiatUnitId).to.equal(res.body.powiaty[0].gusId);
                        expect(mockedUserAfterUpdate.gusVoivodeshipUnitId).to.equal(res.body.voivodeship.gusId);

                        done();


                    });

            });


        });

    });

});
