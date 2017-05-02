'use strict'
const Koa = require('koa')
const mount = require('koa-mount')
const morgan = require('koa-morgan')
const config = require('./config')

const mongoOpts = {
  host: config.mongo.host,
  max: 5,
  min: 1,
  timeout: 30000,
  logout: false
}

// init the connection pool
require('./core/connectionMgr').init(mongoOpts)

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
  const domain = ctx.subdomains[4]
  console.log(domain)
  ctx.tenant = domain || 'default'
  await next()
}

// app.use(validateDomain)
app.use(setTenant)

const v1 = new Koa()
v1.use(require('./services').v1)

// mount the v1 services
app.use(mount('/api/v1/workflow', v1))
module.exports = app
