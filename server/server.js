'use strict'

const config = require('./config')
const app = require('./app')

app.listen(config.app.port, function () {
  console.log('nano-flo services started at ' + config.app.port)
})
