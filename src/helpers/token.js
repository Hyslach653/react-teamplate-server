const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

exports.createToken = id => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '3d' })
}
