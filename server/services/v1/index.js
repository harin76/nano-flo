'use strict'

const Router = require('koa-router')
const router = new Router()

require('./processes').register(router)

module.exports = router.middleware()
