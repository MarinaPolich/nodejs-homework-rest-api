const Joi = require("joi");

const signupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
}).required();

const updateSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
}).required();

module.exports = {
    signupSchema,
    updateSchema,
};
