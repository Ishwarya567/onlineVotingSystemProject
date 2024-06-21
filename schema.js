const Joi = require('joi');

const electionSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  options: Joi.array().items(Joi.string().min(1)).min(2).required()
});

const voteSchema = Joi.object({
  selectedOption: Joi.string().required() // assuming each vote is associated with an option
});

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required()
});

module.exports = { electionSchema, voteSchema, userSchema };
