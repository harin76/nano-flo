'use strict'
const Joi = require('joi')

const stateSchema = exports.stateSchema = Joi.object().keys({
  name: Joi.string().min(3).max(50).required(),
  id: Joi.string().alphanum().min(3).max(50).required(),
  type: Joi.string().min(3).max(50)
        .valid(['start', 'activity', 'human-activiy', 'join', 'decision', 'stop'])
        .required(),
  predecessors: Joi.array().items(Joi.string()).min(1),
  successors: Joi.array().items(Joi.string()).min(1),
  access: Joi.object().keys({
    owners: Joi.array().items(Joi.string()).min(1),
    read: Joi.array().items(Joi.string()).min(1),
    write: Joi.array().items(Joi.string()).min(1)
  }),
  params: Joi.object().keys({
    type: Joi.string().required(),
    isRequired: Joi.boolean().default(true),
    defaultValue: Joi.string()
  }),
  action: Joi.string().required(),
  onError: Joi.string(),
  onSuccess: Joi.string()
})

const versionSchema = exports.versionSchema = Joi.object().keys({
  number: Joi.number().integer().required(),
  isSealed: Joi.boolean().default(false),
  states: Joi.array().items(stateSchema).min(3),
  author: Joi.string().alphanum().min(3).max(50),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
  deletedAt: Joi.date().iso()
})

const schema = exports.schema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(50).required(),
  author: Joi.string().alphanum().min(3).max(50).required(),
  versions: Joi.array().items(versionSchema).required().unique((a, b) => a.number === b.number).min(1),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
  deletedAt: Joi.date().iso()
})

exports.validateProcess = (data) => Joi.validate(data, schema)
exports.validateProcessVersion = (data) => Joi.validate(data, versionSchema)
