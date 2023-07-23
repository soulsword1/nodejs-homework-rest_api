const { model, Schema } = require("mongoose");
const joi = require("joi");
const handleMongooseError = require('../utils/HandleMongooseError');

const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

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

contactsSchema.post("save", handleMongooseError);

const Contact = model("contact", contactsSchema);
const schemas = {
  schemaPost,
  schemaPut,
  schemaUpdateFavorite
}

module.exports = {
  schemas,
  Contact
};
