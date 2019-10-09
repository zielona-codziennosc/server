import chai, {expect} from 'chai';
import chaiHttp  from 'chai-http'


import { User } from "../../models/";
import server from "../../index";
import jwt from "jsonwebtoken";

let should = chai.should();
chai.use(chaiHttp);


describe('User route', function() {
    let authenticationToken;
    this.timeout(10000);

    beforeEach(async () => {
        await User.deleteMany({});
    });


    describe('GET /user/:userId', () => {


        it('should return user of the provided userId', (done) => {

            const email = "admininternetu@example.com";
            const mockedUser = new User({email});
            authenticationToken = jwt.sign({email, id: mockedUser._id}, process.env.JWT_SECRET, {expiresIn: 60*10});

            mockedUser.save().then(() => {
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

    });

});
