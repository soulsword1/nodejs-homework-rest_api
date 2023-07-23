const { isValidObjectId } = require('mongoose');
const httpError = require('../utils/HttpError');

const isValidId = (req, res, next) => {
    const { id } = req.params;
    if(!isValidObjectId(id)){
        next(httpError(400, `${id} is not a valid id`));
    }
    next();
}

module.exports = isValidId;