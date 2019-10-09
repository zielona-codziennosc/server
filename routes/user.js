import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/user';
import authRouter from "./auth";
import {validateParam, schema, stripAuthorizationHeader} from '../helpers/joiResources';
import { authenticate } from "../helpers/utils";

const router = expressPromiseRouter();


router.route('/:userId')
    .get(validateParam(schema.id, 'userId'), authenticate, Controller.get)
    .delete(validateParam(schema.id, 'userId'), stripAuthorizationHeader, authenticate, Controller.remove);

router.use(authRouter);

export default router;
