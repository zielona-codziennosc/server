import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from "express";

import updateUnitsDatabase from "./gusDrivers/databaseBuilding/updateUnitsDatabase";

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
    mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
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
    updateUnitsDatabase();
};

export default { setHeaders, mongo_connect, useMiddleware, kickstartScheduler }
