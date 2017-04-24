'use strict'
const Koa = require('koa')
const mount = require('koa-mount')
const mongo = require('koa-mongo')
const morgan = require('koa-morgan')
const config = require('./config')

const app = new Koa()

// setup the logger
app.use(morgan('combined'))

// async function validateDomain (ctx, next){
//   const domain = ctx.subdomains[4]
//   if (!domains.includes(domain)) {
//     ctx.throw(404, 'tenant not found', {domain})
//   }
//   ctx.tenant = domain
//   await next()
// }

async function setTenant (ctx, next) {
  ctx.tenant = config.mongo.dbName || 'default'
  await next()
}

app.use(mongo({
  host: config.mongo.host,
  max: 5,
  min: 1,
  timeout: 30000,
  logout: false
}))

// app.use(validateDomain)
app.use(setTenant)

const v1 = new Koa()
v1.use(require('./services').v1)

// mount the v1 services
app.use(mount('/api/v1/workflow', v1))
module.exports = app
