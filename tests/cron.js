import chai, {expect} from 'chai';
import chaiHttp from "chai-http";

import User from "../models/user";
import {dailyVariableCleanup} from "../helpers/utils";
import jwt from "jsonwebtoken";

let should = chai.should();
chai.use(chaiHttp);


describe("CRON functions tests", function() {

    this.timeout(10000);

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe("Daily cleanups", () => {

        it("Should remove todaysSavings from all users", done => {

            const mockedTodaysSavings = {
                water: 20,
                plastic: 1,
                carbon: 3000
            };

            const firstMockedUser = new User({email: "example1@example.com", todaysSavings: mockedTodaysSavings});
            const secondMockedUser = new User({email: "example2@example.com", todaysSavings: mockedTodaysSavings});

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


    });
});
