import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/activity';
import {validateBody, schema} from '../helpers/joiResources';
import photoFormRoute from "../helpers/multipartForm";

const router = expressPromiseRouter();


router.route("/coordinates")
    .post(validateBody(schema.activity.coordinates), Controller.coordinates);

router.route("/daily")
    .post(validateBody(schema.activity.daily), Controller.daily);

router.route("/photo")
    .post(photoFormRoute, Controller.addPhoto);

export default router;
