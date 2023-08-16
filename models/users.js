const { model, Schema } = require('mongoose');
const joi = require('joi');
const handleMongooseError = require('../utils/HandleMongooseError');

const usersSchema = new Schema({
    password: {
      type: String,
      required: [true, 'Set password for user'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: String,
    avatarURL: String,
      verify: {
        type: Boolean,
        default: false,
      },
      verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
      }
  })

  const registerSchema = joi.object({
    password: joi.string().min(6),
  
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
  
      subscription: joi.string()
  });

  const loginSchema = joi.object({
    password: joi.string().min(6).required(),
  
    email: joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required()
  });

  usersSchema.post("save", handleMongooseError);

  const User = model("user", usersSchema);
  const schemas = {
    registerSchema,
    loginSchema
  }

  module.exports = {
    schemas,
    User
  }