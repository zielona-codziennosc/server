import expressPromiseRouter from 'express-promise-router';

import Controller from '../controllers/user';
import { validateParam, validateBody, schema, decodeUrlencodedParam } from '../helpers/joiResources';

const router = expressPromiseRouter();


router.route('/')
    .post(validateBody(schema.user.post), Controller.add);

router.route('/:userId')
    .get(validateParam(schema.id, 'userId'), Controller.get)
    .patch([validateParam(schema.id, 'userId'), validateBody(schema.user.patch)], Controller.update)
    .delete(validateParam(schema.id, 'userId'), Controller.remove);

export default router;
