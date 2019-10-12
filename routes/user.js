import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/user';
import authRouter from "./auth";
import activityRouter from "./activity";
import {validateParam, validateBody, schema, stripAuthorizationHeader} from '../helpers/joiResources';
import {authenticate} from "../helpers/utils";

const router = expressPromiseRouter();

router.route('/')
    .post(validateBody(schema.user.post), Controller.add);

router.use(authRouter);

router.use(stripAuthorizationHeader, authenticate);

router.route('/:userId')
    .get(validateParam(schema.id, 'userId'), Controller.get)
    .patch([validateParam(schema.id, 'userId'), validateBody(schema.user.patch)], Controller.update)
    .delete(validateParam(schema.id, 'userId'), Controller.remove);

router.use("/:userId", validateParam(schema.id, 'userId'), activityRouter);


export default router;
