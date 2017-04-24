'use strict'

let config = require('./config.global')

config.env = 'test'
config.mongo.dbName = config.mongo.dbName + '_test'

module.exports = config
