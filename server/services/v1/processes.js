'use strict'
const koaBody = require('koa-body')()
const to = require('await-to-js').default
const Process = require('../../models/process')

const create = async function (ctx, next) {
  ctx.status = 201

  const [error, process] = await
                  to(Process.create(ctx, ctx.params, ctx.request.body))

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
  const [error, result] = await to(Process.find(ctx, ctx.params, ctx.query))

  if (error || result.error) {
    ctx.status = 400
    ctx.body = error || result.error
  } else {
    ctx.body = result
  }

  return next()
}

const findById = async function (ctx, next) {
  ctx.status = 200
  const [error, result] = await to(Process.findById(ctx, ctx.params, ctx.query))

  if (error || result.error) {
    ctx.status = 400
    ctx.body = error || result.error
  } else {
    if (!result) { ctx.status = 404 }
    ctx.body = result
  }

  return next()
}

const createProcessVersion = async function (ctx, next) {
  ctx.status = 201

  const [error, process] = await
                  to(Process.createProcessVersion(ctx, ctx.params, ctx.request.body))

  if (error || process.error) {
    ctx.status = 400
    ctx.body = error || process.error
  } else {
    ctx.body = process
  }
  return next()
}

const findProcessVersionById = async function (ctx, next) {
  ctx.status = 200
  const [error, result] = await to(Process.findProcessVersionById(ctx, ctx.params, ctx.query))

  if (error || result.error) {
    ctx.status = 400
    ctx.body = error || result.error
  } else {
    if (!result) { ctx.status = 404 }
    ctx.body = result
  }
  return next()
}

const updateProcessVersion = async function (ctx, next) {
  const [error, process] = await
                  to(Process.updateProcessVersion(ctx, ctx.params, ctx.request.body))

  if (error || process.error) {
    ctx.status = 400
    ctx.body = error || process.error
  } else {
    ctx.body = process
  }
  return next()
}

const deleteProcessVersion = async function (ctx, next) {
  const [error, process] = await
                  to(Process.deleteProcessVersion(ctx, ctx.params))

  if (error || process.error) {
    ctx.status = 400
    ctx.body = error || process.error
  } else {
    ctx.body = process
  }
  return next()
}

const sealProcessVersion = async function (ctx, next) {
  const [error, process] = await
                  to(Process.sealProcessVersion(ctx, ctx.params))

  if (error || process.error) {
    ctx.status = 400
    ctx.body = error || process.error
  } else {
    ctx.body = process
  }
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
  router.put('/processes/:id/versions/:versionId/seal', koaBody, sealProcessVersion)
}
