export default fieldName => function(next) {

    if(this.constructor.name === "Query" && !(fieldName in this._update))
        next();

    const { uniqueFieldValue, findOne, idOfCurrent, modelName } = getVariablesFromMongooseObjects(this, fieldName);

    findOne({[fieldName]: uniqueFieldValue, _id: {$ne: idOfCurrent}}, (err, documentWithTheUniqueValue) => {
        if(err)
            next(err);
        if(documentWithTheUniqueValue)
            next(`There's already an instance of ${modelName} with field "${fieldName}" of value "${documentWithTheUniqueValue[fieldName]}"`);

        next();
    });
}

const getVariablesFromMongooseObjects = (mongooseObject, fieldName) => {
    let uniqueFieldValue, findOne, idOfCurrent, modelName;


    if(mongooseObject.constructor.name === "Query") {
        idOfCurrent = mongooseObject._conditions._id;
        findOne = mongooseObject.model.findOne.bind(mongooseObject.model);
        uniqueFieldValue = mongooseObject._update[fieldName];
        modelName = mongooseObject.model.modelName;
    }
    else
    {
        idOfCurrent = mongooseObject._id;
        findOne = mongooseObject.constructor.findOne.bind(mongooseObject.constructor);
        uniqueFieldValue = mongooseObject[fieldName];
        modelName = mongooseObject.constructor.modelName;
    }

    return {uniqueFieldValue, findOne, idOfCurrent, modelName};
};

