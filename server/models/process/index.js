'use strict'
const to = require('await-to-js').default
const _ = require('lodash')
const ObjectID = require('mongodb').ObjectID
const ErrorMessage = require('../../utils/errorMessage')
const Errors = require('./errors')
const Schema = require('./schema')
const COLLECTION = 'processes'

class Process {
  static create (ctx, params, data) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)
      let process, result
      let {error, value} = Schema.validateProcess(data)

      if (error) {
        return resolve({
          error: ErrorMessage.createFromJoi(Errors.INVALID_PROCESS_DEFINITION, error)
        })
      }

      [error, process] = await to(collection.findOne({name: value.name}))

      if (error) {
        return resolve({error: Errors.UNKNOWN})
      }

      if (process) {
        return resolve({error: Errors.PROCESS_ALREADY_EXISTS})
      }

      [error, result] = await to(collection.insert(value))

      if (error) {
        return resolve({error: Errors.UNKNOWN})
      }

      resolve(result)
    })
  }

  static find (ctx, params, query) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)
      let error, processes
      [error, processes] = await to(collection.find().toArray())
      if (error) {
        return resolve({error: Errors.UNKNOWN})
      }
      return resolve(processes)
    })
  }

  static findById (ctx, params, query) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)
      let error, process
      [error, process] = await to(collection.findOne({_id: ObjectID(params.id)}))

      if (error) {
        return resolve({error: Errors.UNKNOWN})
      }
      if (!process) {
        return resolve({error: Errors.PROCESS_NOT_FOUND})
      }
      if (!query.includeAllVersions && process.versions.length > 0) {
        // versions are in ascending order, pick the last version
        process.versions = [process.versions[process.versions.length - 1]]
      }
      return resolve(process)
    })
  }

  static createProcessVersion (ctx, params, data) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)
      let process
      let {error, value} = Schema.validateProcessVersion(data)

      if (error) {
        return resolve({
          error: ErrorMessage.createFromJoi(Errors.INVALID_PROCESS_VERSION_DEFINITION, error)
        })
      }

      [error, process] = await to(collection.findOne({_id: ObjectID(params.id)}))

      if (error) {
        return resolve({error: Errors.UNKNOWN})
      }

      if (process === null) {
        return resolve({error: Errors.PROCESS_NOT_FOUND})
      }

      const version = process.versions.find((v) => v.number === value.number)

      if (version) {
        return resolve({error: Errors.PROCESS_VERSION_NUMBER_EXIST})
      }

      value.author = value.author || 'system';

      [error, process] = await to(collection.findOneAndUpdate(
        {_id: ObjectID(params.id)},
        {$push: {versions: value}},
        {returnOriginal: false}
      ))

      if (error) {
        return resolve({error: Errors.UNKNOWN})
      }

      return resolve(process)
    })
  }

  static findProcessVersionById (ctx, params) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)

      let error, process
      const versionToFetch = parseInt(params.versionId)

      if (_.isNaN(versionToFetch)) {
        return resolve({error: Errors.INVALID_PROCESS_VERSION_NUMBER})
      }

      [error, process] = await to(collection.findOne({_id: ObjectID(params.id)}))

      if (error) {
        return resolve({error: Errors.UNKOWN})
      }

      if (process === null) {
        return resolve({error: Errors.PROCESS_NOT_FOUND})
      }

      const version = process.versions.find((v) => v.number === versionToFetch)
      if (!version) {
        return resolve({error: Errors.PROCESS_VERSION_NOT_FOUND})
      }
      return resolve(version)
    })
  }

  static updateProcessVersion (ctx, params, data) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)

      let process
      const versionToFetch = parseInt(params.versionId)

      if (_.isNaN(versionToFetch)) {
        return resolve({error: Errors.INVALID_PROCESS_VERSION_NUMBER})
      }

      let {error, value} = Schema.validateProcessVersion(data)

      if (error) {
        return resolve({
          error: ErrorMessage.createFromJoi(Errors.INVALID_PROCESS_VERSION_DEFINITION, error)
        })
      }

      [error, process] = await to(collection.findOne({_id: ObjectID(params.id)}))

      if (error) {
        return resolve({error: Errors.UNKOWN})
      }

      if (process === null) {
        return resolve({error: Errors.PROCESS_NOT_FOUND})
      }

      const version = process.versions.find((v) => v.number === versionToFetch)

      if (!version) {
        return resolve({error: Errors.PROCESS_VERSION_NOT_FOUND})
      }

      if (version.isSealed) {
        return resolve({error: Errors.PROCESS_VERSION_IS_SEALED})
      }

      const versions = process.versions.map((v) => {
        if (v.number === versionToFetch) {
          return value
        } else {
          return v
        }
      });
      [error, process] = await to(collection.findOneAndUpdate(
        {_id: ObjectID(params.id)},
        {$set: {versions}},
        {returnOriginal: false} // Get the updated document
      ))

      if (error) {
        return resolve({error: Errors.UNKOWN})
      }

      return resolve(process)
    })
  }

  static deleteProcessVersion (ctx, params) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)

      let error, process
      const versionToFetch = parseInt(params.versionId)

      if (_.isNaN(versionToFetch)) {
        return resolve({error: Errors.INVALID_PROCESS_VERSION_NUMBER})
      }

      [error, process] = await to(collection.findOne({_id: ObjectID(params.id)}))

      if (error) {
        return resolve({error: Errors.UNKOWN})
      }

      if (process === null) {
        return resolve({error: Errors.PROCESS_NOT_FOUND})
      }

      const version = process.versions.find((v) => v.number === versionToFetch)

      if (!version) {
        return resolve({error: Errors.PROCESS_VERSION_NOT_FOUND})
      }

      if (version.isSealed) {
        return resolve({error: Errors.PROCESS_VERSION_IS_SEALED})
      }

      const versions = process.versions.filter((v) => v.number !== versionToFetch);

      [error] = await to(collection.findOneAndUpdate(
        {_id: ObjectID(params.id)},
        {$set: {versions}}
      ))

      return resolve({})
    })
  }

  static sealProcessVersion (ctx, params) {
    return new Promise(async (resolve, reject) => {
      const collection = ctx.mongo.db(ctx.tenant).collection(COLLECTION)

      let error, process
      const versionToFetch = parseInt(params.versionId)

      if (_.isNaN(versionToFetch)) {
        return resolve({error: Errors.INVALID_PROCESS_VERSION_NUMBER})
      }

      [error, process] = await to(collection.findOne({_id: ObjectID(params.id)}))

      if (error) {
        return resolve({error: Errors.UNKOWN})
      }

      if (process === null) {
        return resolve({error: Errors.PROCESS_NOT_FOUND})
      }

      const version = process.versions.find((v) => v.number === versionToFetch)

      if (!version) {
        return resolve({error: Errors.PROCESS_VERSION_NOT_FOUND})
      }

      if (version.isSealed) {
        return resolve({error: Errors.PROCESS_VERSION_IS_SEALED})
      }

      const versions = process.versions.map((v) => {
        if (v.number === versionToFetch) {
          v.isSealed = true
        }
        return v
      });

      [error, process] = await to(collection.findOneAndUpdate(
        {_id: ObjectID(params.id)},
        {$set: {versions}},
        {returnOriginal: false}
      ))

      if (error) {
        return resolve({error: Errors.UNKOWN})
      }

      return resolve(process)
    })
  }
}

module.exports = Process
