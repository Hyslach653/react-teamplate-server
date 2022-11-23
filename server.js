// CONFIG
const express = require('express')
const app = express()
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 4000

app.use(require('cors')())
app.use('/static', express.static('resources')) // to server static files
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// SECURITY
app.use(require('helmet')())
app.disable('x-powered-by')
app.use(require('hpp')()) // middleware to protect against HTTP Parameter Pollution attacks
// adding limiter to /user requests to stop brute force attacks
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after an hour'
})

// Apply the rate limiting middleware to API calls only, you can select only some routes like this:
// - app.use('/user', apiLimiter)
app.use(apiLimiter)

// CONNECT TO MONGO
;(async function connecting () {
  try {
    require('mongoose').connect(process.env.MONGO, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    console.log('Connected to the DB 🏋️‍♂️')
  } catch (error) {
    console.log(
      '🔴 ERROR: Seems like your DB is not running, please start it up !!!'
    )
  }
})()

// ROUTES
app.use('/user', require('./src/routes/userRoute.js'))

// 404 HANDLING
app.use('*', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  console.error(
    `Someone with IP ${ip} tried to go to: ${req.path} but got sent an error`
  )
  res.send({ ok: false, body: 'Please, stop inventing' })
})

// SETUP

app.listen(port, () => {
  console.log(`Listening on port: ${port} 🚀🚀🚀`)
})
