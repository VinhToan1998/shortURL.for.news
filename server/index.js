const express = require('express')
const consola = require('consola')

const session = require('express-session')
const Redis = require('ioredis')
const RedisStore = require('connect-redis')(session)
const redisClient = Redis.createClient()
redisClient.on('error', err => {
  console.log('ERROR', 'Redis is not running')
})

const ShortLink = require('./models/shortlink')

const { Nuxt, Builder } = require('nuxt')

const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  require('dotenv').config()

  app.use(session({
    name: 'session',
    store: new RedisStore({ client: redisClient }),
    secret: 'shorturl',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    cookie: {
      maxAge: 3600000 * 3
    }
  }))
  
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/api', require('./routes'))

  app.use(nuxt.render)

  // Give nuxt middleware to express

  app.all('*', (req, rep) => {
    rep.status(404).send({ message: 'Không tìm thấy trang bạn yêu cầu' })
  })
//

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
