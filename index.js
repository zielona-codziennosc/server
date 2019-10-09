import express from 'express';
import dotenv from "dotenv";

import config from './config';

import userRouter from "./routes/user";

dotenv.config();

const app = express();

config.useMiddleware(app);
config.mongo_connect();
config.kickstartScheduler();


app.use('/user', userRouter);

const port = process.env.PORT || 1200;
const server = app.listen(port, err => {
    if(err) throw err;
    console.log(`> Ready on server http://localhost:${port}`)
});

export default server;
