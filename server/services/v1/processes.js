'use strict'
const koaBody = require('koa-body')()
const to = require('await-to-js').default
const Process = require('../../models/process')

const create = async function (ctx, next) {
  ctx.status = 201

  const [error, process] = await
                  to(Process.create(ctx, ctx.request.params, ctx.request.body))

  if (error || process.error) {
    ctx.status = 400
    ctx.body = error || process.error
  } else {
    ctx.body = process
  }

  return next()
}

const find = async function (ctx, next) {
  ctx.status = 200
  // TODO merge query and params into single object
  try {
    const values = await Process.find(ctx, ctx.request.params)
    ctx.body = values
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }
  return next()
}

const findById = async function (ctx, next) {
  ctx.status = 400
  ctx.body = 'findById::To be implemented'
  return next()
}

const createProcessVersion = async function (ctx, next) {
  ctx.status = 400
  ctx.body = 'createProcessVersion::To be implemented'
  return next()
}

const findProcessVersionById = async function (ctx, next) {
  ctx.status = 400
  ctx.body = 'findProcessVersionById::To be implemented'
  return next()
}

const updateProcessVersion = async function (ctx, next) {
  ctx.status = 400
  ctx.body = 'updateProcessVersion::To be implemented'
  return next()
}

const deleteProcessVersion = async function (ctx, next) {
  ctx.status = 400
  ctx.body = 'deleteProcessVersion::To be implemented'
  return next()
}

const sealProcessVersion = async function (ctx, next) {
  ctx.status = 400
  ctx.body = 'sealProcessVersion::To be implemented'
  return next()
}

exports.register = (router) => {
  // POST api/v1/workflow/processes
  router.post('/processes', koaBody, create)

  // GET api/v1/workflow/processes
  router.get('/processes', find)

  // GET api/v1/workflow/processes/:id
  router.get('/processes/:id', findById)

  // POST api/v1/workflow/processes/:id/versions
  router.post('/processes/:id/versions', koaBody, createProcessVersion)

  // GET api/v1/workflow/processes/:id/versions/:versionId
  router.get('/processes/:id/versions/:versionId', findProcessVersionById)

  // PUT api/v1/workflow/processes/:id/versions/:versionId
  router.put('/processes/:id/versions/:versionId', koaBody, updateProcessVersion)

  // DELETE api/v1/workflow/processes/:id/versions/:versionId
  router.delete('/processes/:id/versions/:versionId', deleteProcessVersion)

  // PUT api/v1/workflow/processes/:id/versions/:versionId/seal
  router.post('/processes/:id/versions/:versionId/seal', koaBody, sealProcessVersion)
}
