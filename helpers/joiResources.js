import Joi from 'joi';

export const validateParam = (schema, name) => {
    return (req, res, next) => {
        const result = Joi.validate({ param: req.params[name] }, schema);

        if(result.error) {
            return res.status(400).json(result.error);
        }else{
            if(!req.value) req.value = {};
            if(!req.value.params) req.value.params = {};
            req.value.params[name] = result.value.param;
            next()
        }
    }
};

export const stripAuthorizationHeader = (req, res, next) => {

    const result = Joi.validate({ header: req.header("Authorization") }, schema.jwt);

    if(result.error) {
        return res.status(400).json(result.error);
    }else{
        if(!req.value)
            req.value = {};

        req.value.token = result.value?.header?.split(" ")[1];
        next();
    }
};


export const validateBody = schema => {
    return (req, res, next) => {
        const result = Joi.validate(req.body, schema);
        if(result.error){
            return res.status(400).json(result.error);
        }else{
            if(!req.value) req.value = {};
            if(!req.value.body) req.value.body = {};
            req.value.body = result.value;
            next();
        }
    }
};


export const schema = {
    auth: {
        login: Joi.object().keys({
            googleIdToken: Joi.string().regex(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/).required()
        })
    },
    activity: {
        coordinates: Joi.object().keys({
            coordinates: Joi.string().regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/).required(),
            set: Joi.boolean().default(false)
        }),
        daily : Joi.object().keys({
            waterConsumption: Joi.number().min(0).required(),
            commute: Joi.string().valid(["bus", "eco", "car"]).required(),
            plasticWeight: Joi.number().min(0).required()
        })
    },
    user: {
        update: Joi.object().keys({
            gusPowiatUnitId: Joi.string().regex(/^\d{12}$/).optional(),
            gusVoivodeshipUnitId: Joi.string().regex(/^\d{12}$/).optional()
        })
    },
    id: Joi.object().keys({
        param: Joi.string().regex(/^[0-9a-fA-Z]{24}$/).required()
    }),
    email: Joi.object().keys({
        param: Joi.string().email().required()
    }),
    jwt: Joi.object().keys({
        header: Joi.string().regex(/Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    })
};

export const decodeUrlencodedParam = paramName => (req, res, next) => {
    req.params[paramName] = decodeURI(req.params[paramName]);
    next();
};
