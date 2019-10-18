import chai, {expect} from 'chai';
import chaiHttp  from 'chai-http'

import glob from "glob";
import { User, Photo } from "../../models/";
import server from "../../index";
import jwt from "jsonwebtoken";
import photo from "../../models/photo";
import {annihilatePhotoOfIds} from "../../helpers/utils";

let should = chai.should();
chai.use(chaiHttp);


describe('Activity routes', function() {
    this.timeout(10000);

    const photoStatus = {
        remains: false,
        id: ""
    };

    const email = "admininternetu@example.com";
    let mockedUser, authenticationToken;

    beforeEach(async () => {
        await User.deleteMany({});
        await Photo.deleteMany({});

        mockedUser = new User({email, gusVoivodeshipUnitId: "060600000000", gusPowiatUnitId: "060611163000"});

        mockedUser = await mockedUser.save();

        authenticationToken = jwt.sign({email, id: mockedUser._id}, process.env.JWT_SECRET, {expiresIn: 60*10});
    });

    afterEach( async function(done) {
        if(photoStatus.remains)
            annihilatePhotoOfIds({photoId: photoStatus.id, userId: mockedUser._id});

        photoStatus.remains = false;
        done();
    });



    it("POST /user/:userId/photo with a no-face-containing image | Should accept the photo and make a mongoDB instance of it", (done) => {

        chai.request(server)
            .post(`/user/${mockedUser._id}/photo`)
            .set("Authorization", `Bearer ${authenticationToken}`)
            .attach("photo", "./tests/routes/E.jpg", "E.jpg")
            .end(async (err, res) => {

                res.should.have.status(200);
                expect(res.body.success);
                expect(res.body).to.have.property("id");

                const photoRecord = await Photo.findById(res.body.id);

                expect(photoRecord).to.exist;
                expect(String(photoRecord.userId)).to.equal(String(mockedUser._id));
                expect(String(photoRecord._id)).to.equal(res.body.id);


                glob(`public/areaPhotos/${res.body.id}.*`, (err, files) => {
                    if(err)
                        return;

                    expect(files).to.be.an("array");
                    expect(files.length).to.not.equal(0);

                    photoStatus.remains = true;
                    photoStatus.id = res.body.id;

                    done();
                })
            });
    });

    it("POST /user/:userId/photo with a face-containing image | Should not accept the photo and inform us that it contains faces", (done) => {

        chai.request(server)
            .post(`/user/${mockedUser._id}/photo`)
            .set("Authorization", `Bearer ${authenticationToken}`)
            .attach("photo", "./tests/routes/old_lad.jpg", "old_lad.jpg")
            .end(async (err, res) => {

                res.should.have.status(401);
                expect(res.body.success === false);
                expect(res.body.error).to.equal("Photo contains prohibited content: faces");

                const photoRecord = await Photo.findById(res.body.id);

                expect(photoRecord).to.not.exist;

                done();
            });

    });

    it("DELETE /user/:userId/photo/:photoId | Should delete the photo", (done) => {

        chai.request(server)
            .post(`/user/${mockedUser._id}/photo`)
            .set("Authorization", `Bearer ${authenticationToken}`)
            .attach("photo", "./tests/routes/E.jpg", "E.jpg")
            .end(async (err, firstResponse) => {

                firstResponse.should.have.status(200);
                expect(firstResponse.body.success);
                expect(firstResponse.body).to.have.property("id");

                photoStatus.remains = true;
                photoStatus.id = firstResponse.body.id;

                chai.request(server)
                    .delete(`/user/${mockedUser._id}/photo/${firstResponse.body.id}`)
                    .set("Authorization", `Bearer ${authenticationToken}`)
                    .end(async (err, secondResponse) => {

                        secondResponse.status.should.equal(200);

                        glob(`public/areaPhotos/${firstResponse.body.id}.*`, (err, files) => {
                            if(err)
                                return;

                            expect(files).to.be.an("array");
                            expect(files.length).to.equal(0);

                            photoStatus.remains = false;

                            done();
                        })

                    });

            });
    });

});
