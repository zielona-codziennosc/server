import chai, {expect} from 'chai';
import chaiHttp from "chai-http";

import User from "../models/user";
import {cleanBlacklistCache, dailyVariableCleanup} from "../helpers/utils";
import jwt from "jsonwebtoken";
import cache from "flat-cache";

let should = chai.should();
chai.use(chaiHttp);


describe("CRON functions tests", function() {

    this.timeout(10000);

    const mockedEmails = ["example1@example.com", "example2@example.com"];
    const mockedIds = ["5da87a5291144c2ae02c8df7", "5da87a5291144c2ae02c8df9"];

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe("Clean-ups", () => {

        it("DailyVariableCleanup: Should remove todaysSavings from all users", done => {

            const mockedTodaysSavings = {
                water: 20,
                plastic: 1,
                carbon: 3000
            };

            const firstMockedUser = new User({email: mockedEmails[0], todaysSavings: mockedTodaysSavings});
            const secondMockedUser = new User({email: mockedEmails[1], todaysSavings: mockedTodaysSavings});

            Promise.all([firstMockedUser.save(), secondMockedUser.save()])
                .then(async () => {

                    await dailyVariableCleanup();

                    const users = await User.find({});

                    users.forEach( user => {
                        expect(user.todaysSavings.water).to.be.undefined;
                        expect(user.todaysSavings.plastic).to.be.undefined;
                        expect(user.todaysSavings.carbon).to.be.undefined;
                    });

                    done();
                })

        });

        it("CleanBlacklistCache: Should clean blacklisted tokens from flat-cache", done => {

            const [expiredToken, validToken] = [
                jwt.sign({
                    email: mockedEmails[0],
                    id: mockedIds[0]},
                    process.env.JWT_SECRET,
                    {expiresIn: -10}
                ),
                jwt.sign({
                    email: mockedEmails[1],
                    id: mockedIds[1]},
                    process.env.JWT_SECRET,
                    {expiresIn: 10000}
                )];

            const flatfileOnLogout = cache.load("jwt_blacklist");


            const [expiredTimestamp, validTimestamp] = [jwt.decode(expiredToken).exp, jwt.decode(validToken).exp];

            flatfileOnLogout.setKey(expiredToken, expiredTimestamp);
            flatfileOnLogout.setKey(validToken, validTimestamp);

            flatfileOnLogout.save();


            cleanBlacklistCache();

            const flatfileOnAuthenticate = cache.load("jwt_blacklist");

            const expiredStrawmanRecord = flatfileOnAuthenticate.getKey(expiredToken);
            const validStrawmanRecord = flatfileOnAuthenticate.getKey(validToken);

            expect(expiredStrawmanRecord).to.not.exist;
            expect(validStrawmanRecord).to.equal(validTimestamp);

            done();
        });


    });
});
