import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from "express";
import { schedule } from "node-cron";

import {cleanBlacklistCache, dailyVariableCleanup} from "./helpers/utils";


const setHeaders = res => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
};

const mongo_connect = () => {
    mongoose.set('useCreateIndex', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);

    let mongoUrl;
    switch(process.env.NODE_ENV) {
        case "TEST":
            mongoUrl = process.env.MONGO_URL_TEST;
            break;
        case "PRODUCTION":
            mongoUrl = process.env.MONGO_URL_PRODUCTION;
            break;
        case "DEVELOPMENT":
            mongoUrl = process.env.MONGO_URL_DEVELOPMENT;
            break;
    }


    mongoose.connect(mongoUrl || process.env.MONGO_URL_TEST, { useNewUrlParser: true, useUnifiedTopology: true }).catch(console.log);
};

const useMiddleware = app => {
    app.use(cors({
        origin: '*',
        optionsSuccessStatus: 200
    }));
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(express.static('public'));
};

const kickstartScheduler = () => {
    const dailyVariableCleanupJob = schedule("0 1 * * *", dailyVariableCleanup);
    const cleanBlacklistCacheJob = schedule("0 * * * *", cleanBlacklistCache);
};

export default { setHeaders, mongo_connect, useMiddleware, kickstartScheduler }
