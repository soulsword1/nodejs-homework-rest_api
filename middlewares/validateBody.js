const httpError = require("../utils/HttpError");

const validateBody = schema => {
    const func = (req,res, next) => {
        const query =  Object.keys(req.query).length === 0 ? req.body : req.query;
        const { error } = schema.validate(query);
        if (error) {
            next(httpError(404, error.message));
          }
          next();
    }
    return func;
}

module.exports = validateBody;