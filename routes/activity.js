import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/activity';
import {validateBody, schema, validateParam} from '../helpers/joiResources';
import photoFormRoute from "../middlewares/multipartForm";
import validateImageContent from "../middlewares/validateImageContent";

const router = expressPromiseRouter();


router.route("/coordinates")
    .post(validateBody(schema.activity.coordinates), Controller.coordinates);

router.route("/daily")
    .post(validateBody(schema.activity.daily), Controller.daily);

router.route("/photo")
    .post(photoFormRoute, validateImageContent,Controller.addPhoto);

router.route("/photo/:photoId")
    .delete(validateParam(schema.id, "photoId"), Controller.removePhoto);

export default router;
