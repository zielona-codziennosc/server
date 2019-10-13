import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/user';
import authRouter from "./auth";

import activityRouter from "./activity";
import {validateParam, schema, stripAuthorizationHeader} from '../helpers/joiResources';
import {authenticate} from "../helpers/utils";

const router = expressPromiseRouter();


router.use(authRouter);

router.use(stripAuthorizationHeader, authenticate);

router.route('/:userId')
    .get(validateParam(schema.id, 'userId'), stripAuthorizationHeader, authenticate, Controller.get)
    .delete(validateParam(schema.id, 'userId'), stripAuthorizationHeader, authenticate, Controller.remove);


router.use("/:userId", validateParam(schema.id, 'userId'), activityRouter);


export default router;
