import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/user';
import authRouter from "./auth";

import activityRouter from "./activity";
import {validateParam, schema, stripAuthorizationHeader, validateBody} from '../helpers/joiResources';
import {authenticate, authorize} from "../middlewares/auth";

const router = expressPromiseRouter();


router.use(authRouter);


router.use(stripAuthorizationHeader, authenticate);


router.route('/:userId')
    .all(validateParam(schema.id, 'userId'), authorize)

    .get(Controller.get)
    .patch(validateBody(schema.user.update), Controller.update)
    .delete(Controller.remove);

router.use("/:userId", validateParam(schema.id, 'userId'), authorize, activityRouter);


export default router;
