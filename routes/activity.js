import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/activity';
import { validateBody, schema } from '../helpers/joiResources';

const router = expressPromiseRouter();

router.route("/coordinates")
    .post(validateBody(schema.activity.coordinates), Controller.coordinates)


export default router;
