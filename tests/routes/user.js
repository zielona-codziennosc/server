import chai, {expect} from 'chai';
import chaiHttp  from 'chai-http'


import { User } from "../../models/";
import server from "../../index";
import jwt from "jsonwebtoken";

let should = chai.should();
chai.use(chaiHttp);


describe('User routes', function() {
    this.timeout(10000);

    const email = "admininternetu@example.com";
    let mockedUser, authenticationToken;

    beforeEach(async () => {
        await User.deleteMany({});

        mockedUser = new User({email});

        mockedUser = await mockedUser.save();

        authenticationToken = jwt.sign({email, id: mockedUser._id}, process.env.JWT_SECRET, {expiresIn: 60*10});
    });


    describe('DELETE /user/:userId', () => {

        it('should delete user of the provided userId', (done) => {

            chai.request(server)
                .delete(`/user/${mockedUser._id}`)
                .set("Authorization", `Bearer ${authenticationToken}`)
                .end(async (err, res) => {

                    res.should.have.status(202);

                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body["success"].should.equal(true);

                    done();
                });


        });

    });

    describe('GET /user/:userId', () => {


        it('should return user of the provided userId', (done) => {

            chai.request(server)
                .get(`/user/${mockedUser._id}`)
                .set("Authorization", `Bearer ${authenticationToken}`)
                .end(async (err, res) => {

                    res.should.have.status(200);

                    res.body.should.be.a('object');
                    res.body["email"].should.equal(email);
                    res.body["_id"].should.equal(String(mockedUser._id));

                    done();
                });

        });

    });

    describe('PATCH /user/:userId', () => {


        it('Should update the user and return success', (done) => {

            const sampleUpdates = {
                gusPowiatUnitId: "012415108000",
                gusVoivodeshipUnitId: "042800000000"
            };

            chai.request(server)
                .patch(`/user/${mockedUser._id}`)
                .set("Authorization", `Bearer ${authenticationToken}`)
                .send(sampleUpdates)
                .end(async (err, res) => {

                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    expect(res.body.success);

                    const mockedUserAfterUpdate = await User.findById(mockedUser._id)

                    expect(mockedUserAfterUpdate.gusPowiatUnitId).to.equal(sampleUpdates.gusPowiatUnitId);
                    expect(mockedUserAfterUpdate.gusVoivodeshipUnitId).to.equal(sampleUpdates.gusVoivodeshipUnitId);

                    done();
                });
        });

    });

    describe('PATCH /user/:userId', () => {


        it('Should update the user and return success', (done) => {

            const sampleUpdates = {
                gusPowiatUnitId: "012415108000",
                gusVoivodeshipUnitId: "042800000000"
            };

            chai.request(server)
                .patch(`/user/${mockedUser._id}`)
                .set("Authorization", `Bearer ${authenticationToken}`)
                .send(sampleUpdates)
                .end(async (err, res) => {

                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    expect(res.body.success);

                    const mockedUserAfterUpdate = await User.findById(mockedUser._id)

                    expect(mockedUserAfterUpdate.gusPowiatUnitId).to.equal(sampleUpdates.gusPowiatUnitId);
                    expect(mockedUserAfterUpdate.gusVoivodeshipUnitId).to.equal(sampleUpdates.gusVoivodeshipUnitId);

                    done();
                });
        });

    });

});
