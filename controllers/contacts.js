const joi = require("joi");
const httpError = require("../utils/HttpError");
const controlWrapper = require("../utils/ControlWrapper");
const Contact  = require("../models/contact");

const schemaPost = joi.object({
  name: joi.string().required(),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  phone: joi.string().required(),
  
  favorite: joi.boolean()
});

const schemaPut = joi.object({
  name: joi.string(),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),

  phone: joi.string(),

  favorite: joi.boolean()
});

const schemaUpdateFavorite = joi.object({
  favorite: joi.boolean().required(),
});

const getAll = async (req, res, next) => {
  const result = await Contact.find();
  if (!result) {
    throw httpError(404, "Not Found");
  }
  res.status(200).send(result);
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(result);
};

const addContact = async (req, res, next) => {
  // const { name, email, phone } = req.query;

  const { error } = schemaPost.validate(req.query);
  if (error) {
    throw httpError(400, error.message);
  }
  const result = await Contact.create(req.query);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const changeContact = async (req, res, next) => {
  const { id } = req.params;
  if (!Object.keys(req.query).length) {
    res.status(400).json({ message: "missing fields" });
  }
  const { error } = schemaPut.validate(req.query);

  if (error) {
    throw httpError(404, error.message);
  }
  const result = await Contact.findByIdAndUpdate(id, req.query, {new: true});
  res.status(200).json(result);
};

const changeFavorite = async (req, res, next) => {
  const { id } = req.params;

  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing field favorite" });
  }
  const { error } = schemaUpdateFavorite.validate(req.body);

  if (error) {
    throw httpError(404, error.message);
  }
  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
  res.status(200).json(result);
};


module.exports = {
  getAll: controlWrapper(getAll),
  getById: controlWrapper(getById),
  addContact: controlWrapper(addContact),
  deleteContact: controlWrapper(deleteContact),
  changeContact: controlWrapper(changeContact),
  changeFavorite: controlWrapper(changeFavorite),
};
