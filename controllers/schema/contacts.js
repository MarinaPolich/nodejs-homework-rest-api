const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}).required();

const updateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
}).or("name", "email", "phone");

const updateSchemaStatus = Joi.object({
  favorite: Joi.boolean().required(),
}).required();

module.exports = {
  createSchema,
  updateSchema,
  updateSchemaStatus,
};
