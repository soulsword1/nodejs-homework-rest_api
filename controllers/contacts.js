const httpError = require("../utils/HttpError");
const controlWrapper = require("../utils/ControlWrapper");
const { Contact } = require("../models/contact");
const { schemas } = require("../models/contact");

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { favorite, page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = favorite ?
    (await Contact.find({ owner }, "", { skip, limit: Number(limit) })).filter(contact => String(contact.favorite) === favorite)
    : await Contact.find({ owner }, "", { skip, limit: Number(limit) });

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
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.query, owner });
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
  const result = await Contact.findByIdAndUpdate(id, req.query, { new: true });
  res.status(200).json(result);
};

const changeFavorite = async (req, res, next) => {
  const { id } = req.params;

  if (!Object.keys(req.body).length) {
    res.status(400).json({ message: "missing field favorite" });
  }
  const { error } = schemas.schemaUpdateFavorite.validate(req.body);

  if (error) {
    throw httpError(404, error.message);
  }
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
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
