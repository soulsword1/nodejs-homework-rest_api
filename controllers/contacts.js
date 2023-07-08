const contacts = require("../models/contacts");
const joi = require("joi");
const httpError = require("../utils/HttpError");
const controlWrapper = require("../utils/ControlWrapper");

const schemaPost = joi.object({
  name: joi.string().required(),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),

  phone: joi.string().required(),
});

const schemaPut = joi.object({
  name: joi.string(),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),

  phone: joi.string(),
});

const getAll = async (req, res, next) => {
  const result = await contacts.listContacts();
  if (!result) {
    throw httpError(404, "Not Found");
  }
  res.status(200).send(result);
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const result = await contacts.getContactById(id);
  if (!result) {
    throw httpError(404, "Not Found");
  }
  res.status(200).json(result);
};

const addContact = async (req, res, next) => {
  const { name, email, phone } = req.query;

  const { error } = schemaPost.validate(req.query);
  if (error) {
    throw httpError(400, error.message);
  }
  const result = await contacts.addContact(name, email, phone);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await contacts.removeContact(id);
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
  const result = await contacts.updateContact(id, req.query);
  res.status(200).json(result);
};

module.exports = {
  getAll: controlWrapper(getAll),
  getById: controlWrapper(getById),
  addContact: controlWrapper(addContact),
  deleteContact: controlWrapper(deleteContact),
  changeContact: controlWrapper(changeContact),
};
