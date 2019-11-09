const path = require('path')
const favicon = require('serve-favicon')
const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./logger')

const feathers = require('@feathersjs/feathers')
const configuration = require('@feathersjs/configuration')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')


const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')
const channels = require('./channels')
const Controller = require('./controller/Controller')
const UdpMatrix = require('./controller/UdpMatrix')
const Modes = require('./modes.js')

const app = express(feathers())

// Load app configuration
app.configure(configuration())
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', express.static(app.get('public')))

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

// Init Controller and matrices
let matrices = []
let confMatrices = app.get('matrices')
for (let i = 0; i < confMatrices.length; i++) {
  const matrix = confMatrices[i]
  if (matrix.type === 'UDP') {
    matrices.push({
      name: matrix.name,
      matrix: new UdpMatrix(matrix.width, matrix.height, matrix.host, matrix.port)
    })
  }
}
matrices.forEach((matrix) => {
  matrix.mode = new Modes.AddressRainbow(matrix.matrix)
})

app.$controller = new Controller(matrices)

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware)
// Set up our services (see `services/index.js`)
app.configure(services)
// Set up event channels (see channels.js)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

module.exports = app
