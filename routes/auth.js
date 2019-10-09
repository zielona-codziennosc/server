import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/auth';
import { validateBody, schema, stripAuthorizationHeader } from '../helpers/joiResources';

const router = expressPromiseRouter();


router.route('/login')
    .post(validateBody(schema.auth.login), Controller.login);

router.route('/logout')
    .post(stripAuthorizationHeader, Controller.logout);



export default router;
