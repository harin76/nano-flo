/* eslint-env mocha */
'use strict'

const frisby = require('icedfrisby')
const BASE_URL = 'http://localhost:3000/api/v1/workflow'

frisby.create('Should get processes')
  .get(BASE_URL + '/processes')
  .expectStatus(200)
.toss()
