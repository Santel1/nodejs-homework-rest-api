const Joi = require("joi");

exports.registerUserDataValidator = (data) =>
  Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(10).max(15).required(),
    })
    .validate(data);

exports.loginUserDataValidator = (data) =>
  Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(10).max(15).required(),
    })
    .validate(data);
