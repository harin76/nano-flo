'use strict'
const to = require('await-to-js').default
const Joi = require('joi')
const ErrorMessage = require('../utils/errorMessage')

const stateSchema = Joi.object().keys({
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

const versionSchema = Joi.object().keys({
  number: Joi.number().integer().required(),
  isSealed: Joi.boolean().default(false),
  states: Joi.array().items(stateSchema).min(3),
  author: Joi.string().alphanum().min(3).max(50).required(),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
  deletedAt: Joi.date().iso()
})

const schema = Joi.object().keys({
  name: Joi.string().alphanum().min(3).max(50).required(),
  author: Joi.string().alphanum().min(3).max(50).required(),
  versions: Joi.array().items(versionSchema).min(1),
  createdAt: Joi.date().iso(),
  updatedAt: Joi.date().iso(),
  deletedAt: Joi.date().iso()
})

const COLLECTION = 'processes'

class Process {
  static create (ctx, params, data) {
    const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)
    return new Promise(async (resolve, reject) => {
      let process, result
      let {error, value} = Joi.validate(data, schema)

      if (error) {
        return resolve({error: ErrorMessage.createJoi('PR0001', error)})
      }

      [ error, process ] = await to(collection.findOne({name: value.name}))

      if (error) {
        return resolve({error: ErrorMessage.createJoi('PR0000', 'unexpected error')})
      }

      if (process) {
        return resolve({error: ErrorMessage.create('PR0002', 'Process already Exists')})
      }

      [error, result] = await to(collection.insert(value))
      resolve(result)
    })
  }

  static find (ctx, params) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await ctx.mongo.db(ctx.tenant).collection(COLLECTION)
                                                      .find()
                                                      .toArray()
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  static findById (ctx, params, data) {
    // TODO
  }

  static createProcessVersion (ctx, params, data) {
    // TODO
  }

  static findProcessVersionById (ctx, params, data) {
    // TODO
  }

  static updateProcessVersion (ctx, params, data) {
    // TODO
  }

  static deleteProcessVersion (ctx, params, data) {
    // TODO
  }

  static sealProcessVersion (ctx, params, data) {
    // TODO
  }
}

module.exports = Process
