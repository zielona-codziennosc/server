import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/auth';
import { validateBody, schema } from '../helpers/joiResources';

const router = expressPromiseRouter();


router.route('/login')
    .post(validateBody(schema.auth.login), Controller.login);

export default router;
